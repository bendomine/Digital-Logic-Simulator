# Ben Domine's Digital Logic Simulator

## Changelog - Version 1.1.0

### Improvements and Features

### Reworked Sidebar

- Blocks now appear rendered in the sidebar.
- Blocks can be dragged onto workspace in a more consistent and more intuitive manner.
- The sidebar can be resized by dragging the right edge.
- Blocks in the sidebar now have their own custom right-click menu.
- Blocks can now be deleted from data from the new right-click menu.

### Workspace Improvements

- If multiple blocks are selected, they can now all be dragged together.
- Pressing the 'a' key now selects all blocks in the workspace.
- Added a popup to prevent users from accidentally closing or reloading tab.
- Added support for 'delete' key as well as backspace for deleting blocks.
- The save preview box now accurately displays the appearance of the block.
- Blocks created from the context menu now appear at the original right click location.
- Added a popup when a loop is created.
- Changed the page's title to the name of the repository.

### Pin Editing Improvements

- Adding and removing pins and spacers no longer deletes all wires.
- Improved inconsistent spacing for '+' buttons.
- Added '+' buttons at the very top of the edit menu, and made the ones at the bottom of the lowest item remain present, so that pins/spacers can always be added above/below the rest.
- When adding a pin/spacer to the bottom of the block, the edit menu will automatically scroll to keep it in focus.

---

### Bugfixes

- Fixed the context menu not always appearing when right clicking on some platforms.
- Fixed a crash when a loop is created.
- Fixed a bug where the selection box wouldn't detect blocks in certain circumstances.
- Reordered layers so that the selection box doesn't appear above the sidebar.
- Fixed a bug where blocks would appear above the sidebar and selector when there were about a hundred of them.
- Fixed a bug where deleted blocks would temporarily remain selected, resulting in inconsistent behavior when dragging multiple blocks.
- Fixed a bug in which only half of all selected blocks would be deleted in certain circumstances.
- Fixed a bug in which multiple blocks of the same name could be created.
- Prevented AND and NOT starting blocks from being overwritten.
- Fixed a bug in which all pins on a block could be removed if there was a spacer present.
- Fixed a bug in which the selection box would become offset from the cursor when dragged quickly to the left.
- Fixed a bug in which blocks could be deleted while typing in certain menus.
