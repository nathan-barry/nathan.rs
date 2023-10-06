+++
title = "Security"
date = 2023-09-19T09:40:28-05:00
tags = ["Operating Systems Notes"]
priority = 19
+++

{{< toc >}}



## Security Foundations
***

In our exploration of operating system (OS) security, we will discuss the fundamental differences between security and protection, the historical context of security problems, and the guiding principles of security design.

### Security vs. Protection
**Security** refers to the set of policies that dictate who or what can access a resource. An example of a security policy might be: "Unauthorized users cannot access this file."

On the other hand, **protection** deals with the mechanisms in place to ensure these policies are adhered to. An example would be a system that checks a user's identity against a list of access permissions before granting them access.

It's essential to note that protection mechanisms are responsible for implementing these security policies. While these mechanisms strive to be foolproof, it's challenging to provide absolute guarantees. The reason being, human errors can inadvertently introduce vulnerabilities, which, in turn, can be exploited.

### The Evolution of the Security Problem
Initially, computer systems did not face significant security issues. However, as technology proliferated, so did security concerns. While these issues began to emerge, the initial response was apathy. Fast forward to the present, the frequency and severity of security threats have dramatically increased, prompting heightened awareness and concern. Today, we witness a vast array of threats stemming from diverse sources, necessitating robust and comprehensive security measures.

When designing systems with security in mind, several principles guide the process:

1. **Economy of Mechanism**
    - Simplify. Ensure the system is straightforward and only performs necessary functions.
    - Prioritize the reuse of tried-and-tested components.

2. **Fail-Safe Defaults**
    - By default, access should be denied.
    - This ensures that any oversight or error won't compromise security. If major mistakes occur, they become evident without resulting in security breaches.

3. **Complete Mediation**
    - Remember that security is only as robust as its weakest link.
    - Attackers target the most vulnerable point, so security measures must be holistic, considering the entire system rather than isolated components.

4. **Open Design**
    - Transparency is key. Avoid the pitfall of "security through obscurity."
    - Always assume that potential attackers are privy to all design details.

5. **Separation of Privileges**
    - Diversify privileges based on function or purpose.
    - This compartmentalization ensures greater flexibility in the security system.

6. **Least Privilege**
    - Grant only the essential access rights needed for a task.
    - Any different type of access should necessitate a separate request.

7. **Psychological Acceptability**
    - Ensure that security mechanisms are user-friendly.
    - They should be intuitive enough for users to engage with them without thinking, and should not obstruct valid access requests.

8. **Physical Security**
    - This principle concerns direct threats to the equipment.
    - Threats such as theft, tampering, or destruction necessitate physical preventive measures.

9. **Educate People**
    - Users are often the weakest link in the security chain.
    - Improper practices, like sharing sensitive information over the phone, can jeopardize security. It's essential to be aware of social engineering attacks, which are often low-cost, straightforward, and highly effective.




## The Role of Authentication
***

Operating System (OS) security, as we've previously discussed, is a multi-faceted domain. Among its critical components are **authentication mechanisms** which ensure the validity of a user's identity. 

When a system supports multiple users, it becomes imperative to identify the origin of each action—i.e., who is responsible for what. Each request to the system should carry a user's identity, necessitating the process of authentication to validate these identity tags.

**Passwords** remain a foundational authentication mechanism. Yet, what attributes make a password secure?

### Passwords

For a password to be considered robust, it must exhibit these characteristics:

- **Unguessable**: It shouldn't be easily deciphered by hackers.
- **Easy to Remember & Type**: Usability is key. Users shouldn't struggle to recall or input their passwords.
- **Not Dictionary-Based**: Passwords shouldn't be common words or phrases that can be found in a dictionary.
- **Long Enough**: It should be of sufficient length to deter exhaustive search attempts.

#### Secure Storage of Passwords

Merely having a strong password isn't enough; how they are stored plays a crucial role in security:

- Passwords should be stored in **encrypted** form. During login, the system should encrypt the provided password and match it against the stored encrypted version.
  
- In Linux/Unix environments, encrypted passwords are typically stored in the `/etc/passwd` file.
  
- But, as with all security measures, challenges persist.

#### Challenges in Storing Encrypted Passwords**

- **Encryption Dilemma**: How should passwords be encrypted? The encryption key needs to reside within the system. If one key is used for all passwords, a compromise of that key jeopardizes all.
  
- **Password Duplication**: If two users choose identical passwords, inspecting the file could expose this duplication.

#### Password Salting

One method to bolster password security is the use of **salt**. A salt is random data added to a password before encryption. This means even if two users have the same password, their encrypted passwords will differ due to unique salts.

Using salt primarily counters attacks that capitalize on precomputed encrypted passwords.

#### Remaining Challenges

Despite salting, vulnerabilities persist:

- Passwords in plaintext can exist within the process that checks them.
  
- They may traverse communication channels in plaintext, especially during remote logins or modem-based logins.
  
- Human behavior remains a wild card—users often select weak passwords, recycle them across platforms, seldom update them, and so on.

### Beyond Passwords: Alternative Authentication Mechanisms

While passwords are commonplace, other authentication mechanisms can augment or replace them:

- **Smartcards**: Physical cards that store user credentials.
  
- **Challenge/Response**: A system where users provide answers to security questions.
  
- **Detection of Personal Characteristics**: Biometrics like fingerprints, retina scans, and voice recognition.
  
- And more...




## Common Security Attacks
***

In our continued exploration of operating system security, this installment delves deep into various attack vectors that put system integrity at risk. Below are some common security attacks:

1. **Trojan Horses**
    - **Definition**: A Trojan Horse is a code segment that misuses its environment, acting ostensibly benign while causing damage.
    - **Examples**: Spyware, pop-up browser windows, covert channels.
    - **How it Operates**: It exploits mechanisms that allow programs written by one user to be executed by another.

2. **Trap Door/Back Door**
    - **Definition**: A covert entry point into a system, typically bypassing standard authentication mechanisms.
    - **Examples**: A specific user ID or password bypassing regular security. 

3. **Logic Bomb**
    - **Definition**: A program that triggers a security breach under certain conditions.

4. **Stack and Buffer Overflow**
    - **Definition**: Exploits programmatic errors, causing unintended overflow of the memory stack or buffer.

5. **Rootkits**
    - **Definition**: Programs or files aiming to conceal their existence.
    - **Types**: Based on their concealment locations, they're categorized as Application, Library, Kernel, Hypervisor, and Firmware rootkits.

6. **Viruses**
    - **Definition**: Code fragments embedded in legitimate programs that cause harm.
    - **Propagation**: Typically spread via email or macros in documents.

7. **Worms**
    - **Definition**: A self-replicating program that capitalizes on system vulnerabilities.


    **Spotlight: Stuxnet**:
    This infamous worm targeted Siemens industrial software. Once inside a network, it would sabotage the functioning of Siemens' centrifuge motors, causing physical damage to the equipment.

Designing a robust security policy is relatively straightforward, but implementing it is a challenging endeavor. Essential to remember:

- **Security Costs**: If it's too cumbersome or expensive, users won't adopt it.
  
- **User-Friendliness**: The harder a security measure is to use, the less likely users are to embrace it.
  
- **Appropriateness**: Match the security measure's rigor to the potential threat.
  
- **Post-Breach Challenges**: After a security breach, re-securing is arduous, and breaches are often tough to detect. Systems with bugs inherently have vulnerabilities.

