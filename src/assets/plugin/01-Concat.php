<?php
// concat App JS plugins to 00-App.js file

$files = array(
  'md5/md5.min.js',
  'promise/es6-promise.auto.min.js',
  'cleave/dist/cleave.min.js',
  'sortable/sortable.min.js',
  'dialogflow/ApiAi.min.js',
  'mony/index.js'
);
$content = '';
$dir = __DIR__ . '/';
for ($i = 0; $i < count($files); $i++) {
  $content .= "/* " . $files[$i] . " */\n" . file_get_contents($dir . $files[$i]) . "\n\n";
}
file_put_contents($dir . '00-App.js', $content);
