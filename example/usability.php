<?php

if (!isset($TEMPLATE)) {
  $TITLE = 'Usability Example';
  $NAVIGATION = true;
  $HEAD = '
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
    <link rel="stylesheet" href="hazdev-tablist.css"/>
  ';

  $FOOT = '
    <script src="hazdev-tablist.js"></script>
    <script src="usability.js"></script>
  ';
}

include '_example.inc.php';

?>

<p>
  This page demonstrates the usability requirements outlined by ARIA
  <a href="http://www.w3.org/TR/wai-aria-practices/#tabpanel">here</a>.
  The two tablists below use the rules found at that link for the
  following keyboard keys:
</p>

<ul>
  <li>tab</li>
  <li>left arrow</li>
  <li>right arrow</li>
  <li>up arrow</li>
  <li>down arrow</li>
</ul>

<div id="example-top"></div><hr/>
<div id="example-top-second"></div><hr/>
