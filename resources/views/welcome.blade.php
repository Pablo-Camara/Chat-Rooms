<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Chat Rooms</title>
    </head>
    <body>
        <div id="root"></div>

        @viteReactRefresh
        @vite(['resources/js/app.jsx'])
    </body>
</html>
