<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Chat Rooms</title>
        <style>
            html, body {
                padding: 0;
                margin: 0;
                font-family: Verdana;
            }
        </style>
    </head>
    <body>
        <div id="root"></div>

        @viteReactRefresh
        @vite(['resources/js/app.jsx'])
    </body>
</html>
