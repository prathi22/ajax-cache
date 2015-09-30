# Introduction #

This document is step-by-step explanation how to use ajax-cache. In this explanation I will use "GET" type of ajax requests with parameters and results sent in json format.

# Initialization #

  1. Include latest version of ajax-cache to your website:
```
<script type="text/javascript" src="http://www.example.com/scripts/ajaxCache-0.2.1.min.js"></script>
```
  1. Create global cache object. Better add it at the very beginning of your javascript code:
```
var cache = new ajaxCache('GET', true, 1800000); // record the new response
```
> Here we created cache object, where:
    * `'GET'` - (String) type of your ajax method. See all [available types](http://code.google.com/p/ajax-cache/#Supported_types);
    * `true` - (Bool) means that cache is turned on. You can initialize it with `false` and turn it on later with this line: `cache.onOff(true)` or turn off: `cache.onOff(false)`;
    * `1800000` - (int) default lifetime of client-side caching in miliseconds. (1800000=30min, 300000=5min, 30000=30sec).

Now client-side caching is initialized and ready to work. Continue to wrap your ajax code with ajax-cache.

# Ajax code wrapping #

  1. Locate your ajax code. In this example we use jQuery ajax, it looks like this:
```
$.ajax({
  url: ajax_path,
  type: 'GET',
  data: viewData,
  dataType: 'json'
  success: function(response) {
    // update website
    update_website(response);
  },
  error: function(xhr) {
    // handle errors
    handle_errors(xhr);
  },
});
```
    * `ajax_path` - global address of ajax path/URL. Ex: `ajax_path = 'http://www.example.com/views/ajax';`;
    * `viewData` - parameters as json object.
  1. Move your ajax code to a separate function. It is always usefull to do.
```
function perform_ajax(viewData)
{

  // ajax code
  $.ajax({
    url: ajax_path,
    type: 'GET',
    data: viewData,
    dataType: 'json'
    success: function(response) {
      // update website
      update_website(response);
    },
    error: function(xhr) {
      // handle errors
      handle_errors(xhr);
    },
  });

}
```
> > And insted of previous location of your ajax code, call a new function:
```
perform_ajax(viewData);
```
  1. Add response recording (enable to create cache):
```
  if(cache.on) cache.put(ajax_path, viewData, response); // record a new response
```
> > Put it right before updating your website. In this example just above `// update website`.
  1. Add response recovery (loading response from local cache):
```
  if(cache.on)
  {
    var cachedResponse = cache.get(ajax_path, [viewData]);
    if(cachedResponse !== false)
    {
      // update website
      update_website(cachedResponse); // We just avoided one ajax request
      return true;
    }
  }
```
> > Add this code above your ajax code in a new function.
  1. So your final `perform_ajax()` function should look like this:
```
function perform_ajax(viewData)
{
  if(cache.on)
  {
    var cachedResponse = cache.get(ajax_path, [viewData]);
    if(cachedResponse !== false)
    {
      // update website
      update_website(cachedResponse); // We just avoided one ajax request
      return true;
    }
  }
  $.ajax({
    url: ajax_path,
    type: 'GET',
    data: viewData,
    dataType: 'json'
    success: function(response) {
      if(cache.on) cache.put(ajax_path, viewData, response); // record a new response
      // update website
      update_website(response);
    },
    error: function(xhr) {
      // handle errors
      handle_errors(xhr);
    },
  });
  
  return true;
}
```
  1. Remember to check if it works and enjoy.

# Additional #
  * You can always chacge cache lifetime individually if you need, just add additional parameter on puting cache, ex.:
```
      if(cache.on) cache.put(ajax_path, viewData, response, 600000);
```
> > This particular result will be cached for 10 minutes.