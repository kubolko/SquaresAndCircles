<script>
  import { writable, get } from "svelte/store";
  import * as FirebaseStore from "../stores/FirebaseStore.js";

  export let card;

  if (typeof card.x !== "number" || typeof card.y !== "number") {
    throw new Error("Card x and y are required");
  }

  let position = writable({ x: card.x, y: card.y });
  let isDragging = false;
  let isResizing = false;
  let startX,
    startY,
    initialX = card.x,
    initialY = card.y;
  let startWidth, startHeight, startResizeX, startResizeY;

  let showContextMenu = false;
  let contextMenuPosition = { x: 0, y: 0 };

  function onMouseDown(event) {
    if (!isResizing) {
      isDragging = true;
      FirebaseStore.updateDraggingState(card, isDragging);
      startX = event.clientX - card.x;
      startY = event.clientY - card.y;
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }
  }

  function onMouseMove(event) {
    if (isDragging) {
      event.preventDefault();
      const newX = event.clientX - startX;
      const newY = event.clientY - startY;
      position.set({ x: newX, y: newY });

      if (showContextMenu) {
        contextMenuPosition = { x: newX + 20, y: newY + 10 };
      }
      FirebaseStore.updatePosition(card, $position);
      console.log("Card position updated to:", $position);
    }
  }

  function onMouseUp() {
    isDragging = false;
    FirebaseStore.updateDraggingState(card, isDragging);
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  }

  function onResizeMouseDown(event) {
    isResizing = true;
    startWidth = card.width;
    startHeight = card.height;
    startResizeX = event.clientX;
    startResizeY = event.clientY;
    window.addEventListener("mousemove", onResizeMouseMove);
    window.addEventListener("mouseup", onResizeMouseUp);
  }

  function onResizeMouseMove(event) {
  if (isResizing) {
    event.preventDefault();
    const newWidth = startWidth + event.clientX - startResizeX;
    const newHeight = startHeight + event.clientY - startResizeY;
    card.width = newWidth > 100 ? newWidth : 100;
    card.height = newHeight > 100 ? newHeight : 100;

    FirebaseStore.updateSize(card, { width: card.width, height: card.height });
  }
}

  function onResizeMouseUp() {
    isResizing = false;
    window.removeEventListener("mousemove", onResizeMouseMove);
    window.removeEventListener("mouseup", onResizeMouseUp);
  }

  function onRightClick(event) {
    event.preventDefault();
    showContextMenu = true;
    contextMenuPosition = { x: $position.x + 20, y: $position.y + 10 };
    window.addEventListener("click", onWindowClick);
  }

  function onContextMenuOptionClick(option) {
    console.log(`Option ${option} clicked`);
    hideContextMenu();
  }

  function onWindowClick(event) {
    if (event.button !== 2) {
      hideContextMenu();
    }
  }

  function hideContextMenu() {
    showContextMenu = false;
    window.removeEventListener("click", onWindowClick);
  }

  function moveUp() {
    // If the card is already at the top, increment both z index and topZ
    if (card.z == card.topZ){
      card.z += 1;
      card.bottomZ += 1;
      FirebaseStore.updateTopZIndex(card, card.bottomZ);
      FirebaseStore.updateZIndex(card, card.z);
    }
    // If the z index is not the top one, just increment the z index
    else {
      card.z += 1;
      FirebaseStore.updateZIndex(card, card.z);
    }
  }

  function moveDown(){
    // If the card is already at the bottom, decrement both z index and bottomZ
    if (card.z == card.bottomZ){
      card.z -= 1;
      card.bottomZ -= 1;
      FirebaseStore.updateBottomZIndex(card, card.bottomZ);
      FirebaseStore.updateZIndex(card, card.z);
    }
    // If the z index is not the bottom one, just decrement the z index
    else {
      card.z -= 1;
      FirebaseStore.updateZIndex(card, card.z);
    }
  }

  function moveToTop(){
    card.z = card.topZ + 1;
    FirebaseStore.updateZIndex(card, card.z);
    FirebaseStore.updateTopZIndex(card, card.topZ);
  }
  
  function moveToBottom(){
    card.z = card.bottomZ - 1;
    FirebaseStore.updateZIndex(card, card.z);
    FirebaseStore.updateBottomZIndex(card, card.bottomZ);
  }

  function removeCard(){
    FirebaseStore.removeCard(card);
  }

</script>

<div
  style="position: absolute; left: {$position.x}px; top: {$position.y}px; user-select: none; width: {card.width}px; height: {card.height}px; border-radius: 15px; background: {card.color}; padding: 20px; box-sizing: border-box; color: white; display: flex; flex-direction: column; justify-content: space-between;"
  on:mousedown={onMouseDown}
  on:contextmenu={onRightClick}
>
  <h2
    contenteditable="true"
    on:input={(event) => FirebaseStore.updateTitle(event, "title")}
  >
    {card.title}
  </h2>
  <p
    contenteditable="true"
    on:input={(event) => FirebaseStore.updateText(event, "text")}
  >
    {card.text}
  </p>
  <div class="resize-handle" on:mousedown={onResizeMouseDown}></div>
</div>

{#if showContextMenu}
  <div
    style="position: absolute; left: {contextMenuPosition.x}px; top: {contextMenuPosition.y}px; background: white; border: 1px solid black;"
  >
    <button on:click={() => onContextMenuOptionClick(1)}>Move to the top</button
    >
    <button on:click={() => onContextMenuOptionClick(2)}>Move up</button>
    <button on:click={() => onContextMenuOptionClick(3)}>Move down</button>
    <button on:click={() => onContextMenuOptionClick(4)}
      >Move to the bottom</button
    >
    <button on:click={() => onContextMenuOptionClick(5)}>Remove</button>
  </div>
{/if}

<style>
  .resize-handle {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 10px;
    height: 10px;
    background: red;
    cursor: se-resize;
  }
</style>
