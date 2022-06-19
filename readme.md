# rss gheist
## simple, free, client-side
I created rss gheist because I needed a simple RSS reader with notifications. All offers I found required me to sign up, so I took a weekend to create this simple, client-side RSS reader. No registration needed, no configuration needed...

## but... CORS
The initial test immediately showed a critical flaw of this client-side only design: CORS.

Now don't get me wrong here, CORS is something good, but since it prevents JS from getting data from an RSS feed (unless the feed has an `Access-Control-Allow-Origin: *` HTTP header specified), it basically killed the idea of client-side only.

But, there always is a way, and in this case it is a CORS proxy. There are many out there, and you can even create your own with the `corsproxy.php` file from rss gheist's repository. The proxy runs on a server, fetches the data from the RSS feed and adds the `Access-Control-Allow-Origin: *` HTTP header we need for the client-side script to retrieve the data.

Search for a proxy you like or create your own, then add the proxy's URL in the settings field in a format where only the feed's URL needs to be appended. For example, if you use the `corsproxy.php` on `yourserver.com`, you would enter `https://yourserver.com/corsproxy.php?url=`. Now rss gheist can fetch the feed's data!