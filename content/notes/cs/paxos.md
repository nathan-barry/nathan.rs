+++
title = "Multi-Paxos Implementation"
description = "These are my notes over Paxos"
date = 2024-03-11T06:38:59-05:00
tags = ["Computer Science Notes"]
draft = true
+++

{{< toc >}}

## Overview
---
For my distributed systems class, I need to implement Paxos. Paxos is a protocol for state machine replication in an asynchronous environment that admits crash failures. State machine replication behaves logically identical to a single remote state machine that never crashes.

These are my notes over *Paxos Made Simple* and *Paxos Made Moderately Complex*, written to help me understand and digest what I need to implement.

Assume agents communicate with each other by sending messages. We use the asynchronous, non-Byzantine model where:
- Agents operate at arbitrary speed, may fail by stopping, and may restart.
- Messages can take arbitrarily long to be delivered, be duplicated or lost, but not corrupted.

Below I give an outline for my Multi-Paxos implementation.



## Messages
---
Sent from Client
- `PaxosRequest(client_addr, client_seq_num, command)`
    - Sent from client to server

Sent From Replica
- `Propose(slot_num, command)`
    - Sent from replica to all leaders after replica receives `PaxosRequest` and there has been no decision for the command.
- `PaxosReply(client_seq_num, result)`
    - Sent from server to client after command execution after receiving `Decision`

Sent From Leader
- `p1aRequest(leader_addr, ballot_num)`
    - Sent from leader to acceptor if new leader 
        - Acceptor adopts `ballot_num` if it is larger than `self.acceptor_ballot_num`
        - Acceptor sends `p1bResponse` to `leader_addr` containing all the `pvalues` in `self.accepted`
- `p2aRequest(leader_addr, pvalue (ballot_num, slot_num, command))`
    - Sent from leader with pvalue to acceptor on receive `Propose`
        - If `ballot_num` > `self.acceptor_ballot_num`, set it to `ballot_num`
        - If current `ballot_num == self.acceptor_ballot_num`, acceptor puts pvalue in `self.accepted`
        - Acceptor sends `p2bResponse` to `leader_addr` containing current `self.acceptor_ballot_num`
- `Decision(slot_num, command)`
    - Sent from Leader to all Replicas if received majority `p2bResponse` 

Sent From Acceptors
- `p1bResponse(acceptor_addr, ballot_num, pvalues)`
    - Sent from acceptor to leader after receiving `p1aRequest`
        - If leader receives this from more than half, that means leader was accepted
        - If leader recieves this but `ballot_num != self.leader_ballot_num`, then leader goes inactive
- `p2bResponse(acceptor_addr, ballot_num)`
    - Sent from acceptor to leader after receiving `p2aRequest`
        - If leader receives this from a majority of acceptors, then proposal has been chosen for slot_num. Leader sends `Decision` to replicas
        - If leader recieves this but `ballot_num != self.leader_ballot_num`, then leader goes inactive



## Server Details
---

### Server State
General State
- `self.servers`: list of all servers

Replica State
- `self.state`
    - This is the application state.
- `self.slot_num`
    - This is the server's current slot number. Contains the index of the next slot for which it needs to learn a decision before it can update the application state.
- `self.proposals`
    - A map of (slot_num -> command) pairs for proposals that the replica has made in the past
- `self.decisions`
    - Another map of (slot_num -> command) pairs for decided slots

Acceptor State
- `self.acceptor_ballot_num`: pair (round_num, leader_address)
- `self.accepted`: A set of pvalues

Leader State
- `self.leader_ballot_num`: pair (round_num, leader_address)
- `self.active`: boolean flag
- `self.proposals`: a map of (slot_num -> proposals)

<!-- ### Server Handlers -->
<!-- Replica -->
<!-- - `HandlePaxosRequest(PaxosRequest m, Address sender)` -->
<!--     - Replica invokes `propose(m.command)` for the lowest unused slot -->
<!--         - This function checks whether there has been a decision for `command` arleady -->
<!--             - If so, ignore -->
<!--             - Else, determine the lowest unused slot number and add (slot_num, command) to its set of proposals -->
<!--                 - Then send `ProposeRequest(slot_num, command)` to all leaders -->

<!-- - `HandleDecisionRequest` -->
<!--     - Adds it to `self.decision` -->
<!--     - Loops over each, considers which decisions are ready for execution -->
<!--     - If there is a decision that corresponds to the current slot_num, the server checks to see if it has proposed a different command for that slot_num. If so, repropose the command with a new slot number before executing the decided command. -->

<!-- Leader -->
<!-- - `HandleDecisionRequest` -->

<!-- Acceptor -->




## Client Details
---

### Client Handlers
- `HandlePaxosReply(PaxosReply m, Address sender)`
    - TODO




## Misc
---
### Invariants
Replica Invariants
- Each decided slot has one unique command across all servers
- All commands up to `slot_num` are in the set of decisions
- For all servers, `self.state` is the result of executing all commands in order
- `self.slot_num` cannot decrease over time

Acceptor Invariants
- An acceptor can only adopt strictly increasing ballot numbers
- An acceptor can only add a pvalue to accepted if the pvalue.ballot_num == self.ballot_num
- All acceptors will accept only one proposal for a particular slot number and ballot number
- If most acceptors accepted a pvalue, then if a future pvalue is accepted for that same slot, then the commands will be the same

### State reduction
- Acceptors only maintain most recently accepted pvalue for each slot
    - Return only these values in a p1b message to scout

- Leader keeps track of which slots have been completed.
    - Includes on the p1a request the first slot for which it does not know the decision
    - Acceptors do not need to respond with pvalues for smaller slot numbers

- Set requests maintained by server only needs to contain those requets for slot numbers higher than slot_num

- Leader maintains proposals for all slots, starts new commander for each upon turning active.
    - If know which have been decided already, can not start commander for those slots

### Garbage collection
- When all servers learned a slot has been decided, there is no reason to have the corresponding pvalues in `self.accepted` set
    - Servers could respond to leader when they have performed a command
        - When leader hears all replicas have done so, it can notify all to release the state
    - Server has new variable collected_slot_num which shows that all lover slot number has been collected
        - Need to be included in p1b messages so leader doesn't conclude acceptors didn't accept any pvalues for those commands
    - Doesn't work if one server is slow or fails, but we won't be tested on that
