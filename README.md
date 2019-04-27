A fork of [Autopagerize for Chrome](https://github.com/swdyh/autopagerize_for_chrome), fully reworked to reduce memory consumption and increase performance:

* the background page now auto-unloads when inactive
* the content script is added to a web page only if its URL has a matching rule
* the content script unregisters all of its listeners when there are no more pages to load according to the paging rules - and thus it gets removed by the garbage collector (several megabytes per each tab)
* the URL matching regexps are cached upon each run of the background page so subsequent checks during the run are almost 100 times faster and take just a few milliseconds (the background page unloads after approximately five seconds of no navigation activity)
* IndexedDB is used to store the data objects directly whereas the previously used localStorage serialized them into a string 
* Simple one-time messaging and in-place code execution is used when needed instead of the persistent communication ports that were created for all the browser tabs

Differences to the original:

* Exclusions are matched to the full URL now unless there's a `*` at the end. The original extension has been incorrectly treating all non-regexp URLs as prefixes.
  * `http://foo.com/bar` - this exact URL
  * `http://foo.com/bar*` - URLs that start with `http://foo.com/bar`
  * `*.foo.com/bar` - URLs that end in `foo.com/bar`
  * `*://*.foo.com/bar*` - URLs that contain `foo.com/bar` anywhere
  
![popup](https://i.imgur.com/lC8aWNF.png)

New features in popup:

* Load 1-100 more pages
* Exclude current page URL/prefix/domain

New features in options:

* Custom rules in options
* Import/export of settings

![options](https://i.imgur.com/UVp4NnR.png)
