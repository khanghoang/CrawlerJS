# CrawlerJS wiki

* [Plugin system](#plugin-system)
* [Events](#events)

<a name="plugin-system"></a>
### Plugin system

CrawlerJS can be plugged and extended by hooking into the system's events and
modifying the parameters passed to the step. You can check out more about this
plugin system by reading the documentation from [Eventary][0].



### Events

* `start`: fired when the system starts.
* `round`: when a fetch cycle starts, it will emmit this event.
* `fetch`: fired as soon as the system is ready to request the HTML to the
remote URI.
* `extract`: when the extraction system kicks in, this event will rise.
* `extracted`: fired each time the exctrator successfully extracts some data.
* `end`: when there is no more things to do.

[0]: https://github.com/alanhoff/node-eventary
