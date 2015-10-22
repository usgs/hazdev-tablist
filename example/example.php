<?php

if (!isset($TEMPLATE)) {
  $TITLE = 'Tablist Example';
  $NAVIGATION = true;
  $HEAD = '
    <link rel="stylesheet" href="hazdev-tablist.css"/>
  ';

  $FOOT = '
    <script src="hazdev-tablist.js"></script>
    <script src="example.js"></script>
  ';
}

include '_example.inc.php';

?>

<p>
  To see how the tablist adheres to ARIA usability standards,
  <a href="usability.php">view the usability page</a>.
</p>

<div class="tablist">
  <section class="panel" data-title="Tab 1">
    <header>
      <h2>Tab 1, with more content in panel header</h2>
    </header>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
      quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
      consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
      cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
      proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
  </p>
  </section>
  <section class="panel" data-title="Tab 2" data-selected="true">
    <header>
      <h2>Tab 2</h2>
    </header>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
      quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
      consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
      cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
      proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </p>
  </section>
</div>

</div>
<div id="example-left"></div>
<div id="example-top"></div>
<div id="example-right"></div>
