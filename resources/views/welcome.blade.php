<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Gestion Mtech</title>

        <!-- Fonts -->


        @viteReactRefresh
        @vite(['resources/js/src/index.css', 'resources/js/src/main.tsx'])
       
    </head>
    <body >
        <div id="root"></div>
    </body>
</html>
