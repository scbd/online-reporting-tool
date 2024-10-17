var widgetDocument = document || {}
var origin = findOrigin() || "https://ort.cbddev.xyz"

function embedIFrame(widget, options) {
  if (!options.src) return

  var iframe = widgetDocument.createElement("iframe")

  iframe.setAttribute(
    "name",
    Math.floor((1 + Math.random()) * 0x10000).toString(16)
  )
  iframe.setAttribute("src", `${options.src}&iframe=${iframe.name}`)
  iframe.setAttribute("width", options.width || "100%")
  iframe.setAttribute("height", options.height || 500)
  iframe.setAttribute("frameborder", "0")
  iframe.setAttribute("scrolling", "no")

  widget.parentNode.replaceChild(iframe, widget)

  window.addEventListener("message", function(evt) {
    var trustedHosts = [/.*\.cbddev\.xyz$/i, /.*\.cbd\.int$/i, /localhost:\d/]

    var isTrustedHost = trustedHosts.find(e => {
      return e.test(evt.origin)
    })

    if (isTrustedHost && evt.data) {
      var data = JSON.parse(evt.data)
      if (data.type == "setClientHeight" && data.iframe == iframe.name) {
        iframe.setAttribute(
          "height",
          data.height ? data.height + 20 : iframe.height
        )
      }
    }
  })
}

function embedRecord() {}

function embedCountryProfile(code, options) {}

function embedSearchResult(searchKey, options) {}

function getAttributeValue(widget, attribute) {
    if(!widget)
        return;
    else if (widget.attributes[attribute]) 
        return widget.attributes[attribute].value
    else if (widget.dataset[attribute]) 
        return widget.dataset[attribute]
}
function onReady(callbackFunc) {
  if (widgetDocument.readyState !== "loading") {
    //already loaded
    callbackFunc()
  } else if (widgetDocument.addEventListener) {
    //modern browser
    widgetDocument.addEventListener("DOMContentLoaded", callbackFunc)
  } else {
    //old IE
    widgetDocument.attachEvent("onreadystatechange", function() {
      if (widgetDocument.readyState === "complete") {
        callbackFunc()
      }
    })
  }
}

function initWidget() {
  var widgets = findScbdWidgets()

  for (var key in widgets) {
    if (Object.hasOwnProperty.call(widgets, key)) {
      var widget = widgets[key]
      var locale = (widget.dataset||{}).locale || "en"

      var urlMapping = {
        "national-target-analyzer": "/national-targets/analyzer",
        "nbsap"                   : "/nbsaps/analyzer",
        "url"                     : 'raw'
      }
      var type = getAttributeValue(widget, "type")

      if (urlMapping[type]) {
        var width = getAttributeValue(widget, "width") || "100%"
        var height = getAttributeValue(widget, "height") || "500"

        var iframeSrc = `${origin}/${locale}`;
        if(urlMapping[type] == 'raw'){

          var rawUrl = getAttributeValue(widget, "url");
          var parsedRawUrl = new URL(rawUrl);

          if(!/ort\.cbd\.int$/.test(parsedRawUrl.hostname) && !/ort\.cbddev\.xyz$/.test(parsedRawUrl.hostname)){
              throw new Error('Only ORT domain is allowed.');
          }

          iframeSrc = parsedRawUrl.toString();
        }
        else
          iframeSrc += `${urlMapping[type]}?embed=true`

        if (widget.dataset.recordTypes) {
          var recordTypes = widget.dataset.recordTypes.split(/;|,|\s/)
          iframeSrc += `&recordTypes=${recordTypes.join("&schema=")}`
        }
        if (widget.dataset.globalTargets) {
          var globalTargets = widget.dataset.globalTargets.split(/;|,|\s/)
          iframeSrc += `&globalTargets=${globalTargets.join("&globalTargets=")}`
        }
        if (widget.dataset.globalGoals) {
          var globalGoals = widget.dataset.globalGoals.split(/;|,|\s/)
          iframeSrc += `&globalGoals=${countries.join("&globalGoals=")}`
        }
        if (widget.dataset.countries) {
          var countries = widget.dataset.countries.split(/;|,|\s/)
          iframeSrc += `&country=${countries.join("&country=")}`
        }
        if (widget.dataset.regions) {
          var regions = widget.dataset.regions.split(/;|,|\s/)
          iframeSrc += `&region=${regions.join("&region=")}`
        }

        if (widget.dataset.share) {
          var share = widget.dataset.share.split(/;|,|\s/)
          iframeSrc += `&share=${share.join("&share=")}`
        }

        var options = {
          src: iframeSrc,
          width: width,
          height: height
        }
        embedIFrame(widget, options)
      } else {
        embedIFrame(widget, { src: `${origin}/param-missing.html?` })
      }
    }
  }
}

function findScbdWidgets(classNames) {
    
    classNames = classNames || ["scbd-ort-embed"]
    var widgetElements = [];

    for (let i = 0; i < classNames.length; i++) {
        var className = classNames[i];

        var elements = widgetDocument.getElementsByClassName(className)
        for (let e = 0; e < elements.length; e++) {
            widgetElements.push(elements[e]);            
        }        
    }

    return widgetElements;
}

function findOrigin() {
  if (!widgetDocument) return
  var scripts = widgetDocument.getElementsByTagName("script")

  for (var i = 0; i < scripts.length; i++) {
    var element = scripts[i]
    if (element.src) {
      var url = new URL(element.src)
      if (
        /\/embed-widget\.js/.test(url.pathname) &&
        (/\.cbd\.int/.test(url.host) ||
          /\.cbddev\.xyz/.test(url.host) ||
          /localhost:3000/.test(url.host))
      ) {
        return url.origin
      }
    }
  }
}

onReady(initWidget)