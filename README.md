# AutoLoadingFiles
With this framework you can load simply yours JavaScript and CSS files with other file.
Priority and groups loading are managed.

Exemple of Js use :
<code>
scripts.loadScripts("index", function() {
  // Write your code you wants to load after files loaded.
});
</code>
Exemple of xml statment :
<code>
  <script for="index" priority="1">./js_for_pages/index.js</script>
  <style for="index" priority="2">./css_for_pages/index.css</style>
</code>
