{{ $id := md5 .Inner }}
<div class="checkbox">
    <div class="box"></div>
    {{ .Inner }}
</div>
