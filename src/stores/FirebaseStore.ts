import { getDatabase, ref, child, get, set, onValue, remove } from "firebase/database";
import { firebaseApp } from "../firebase_options.js";
import { writable } from 'svelte/store';
import type { RetrospectiveCard } from '../models/RetrospectiveCard';
import _ from 'lodash';

const database = getDatabase(firebaseApp);
const databaseReference = ref(database);

let retrospectiveCards = writable<RetrospectiveCard[]>([]);
let previousData: RetrospectiveCard[] = [];

async function fetchInitialPositions() {
  const topZIndexSnapshot = await get(child(databaseReference, 'topZIndex'));
  const bottomZIndexSnapshot = await get(child(databaseReference, 'bottomZIndex'));

  let topZIndex = topZIndexSnapshot.exists() ? topZIndexSnapshot.val() : 0;
  let bottomZIndex = bottomZIndexSnapshot.exists() ? bottomZIndexSnapshot.val() : 0;

  const snapshot = await get(child(databaseReference, 'circlePositions'));

  if (snapshot.exists()) {
    const data = snapshot.val();
    const newData = Object.values(data).map((value: any): RetrospectiveCard => ({
      id: value.id,
      x: parseFloat(value.x),
      y: parseFloat(value.y),
      z: parseInt(value.z),
      title: value.title,
      text: value.text,
      color: value.color,
      height: parseFloat(value.height),
      width: parseFloat(value.width),
      isCurrentlyDragged: Boolean(value.isCurrentlyDragged),
      topZ: topZIndex,
      bottomZ: bottomZIndex,
    }));

    if (!_.isEqual(newData, previousData)) {
      retrospectiveCards.set(newData);
      previousData = newData;
    }
  }
}

function listenToCardPositions() {
  onValue(child(databaseReference, 'circlePositions'), async (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
  
      const topZ = await getTopZIndex();
      const bottomZ = await getBottomZIndex();
  
      const newData = Object.values(data).map((value: any): RetrospectiveCard => ({
        id: value.id,
        x: parseFloat(value.x),
        y: parseFloat(value.y),
        z: parseInt(value.z),
        title: value.title,
        text: value.text,
        color: value.color,
        height: parseFloat(value.height),
        width: parseFloat(value.width),
        isCurrentlyDragged: Boolean(value.isCurrentlyDragged),
        topZ: topZ,
        bottomZ: bottomZ,
      }));
  
      if (!_.isEqual(newData, previousData)) {
        retrospectiveCards.set(newData);
        previousData = newData;
      }
    }
  });
}

function updateCard(retrospectiveCard: RetrospectiveCard) {
  console.log(retrospectiveCard);
  return set(child(databaseReference, `circlePositions/${retrospectiveCard.id}`), retrospectiveCard);
}

function updateRetrospectiveCardPosition(retrospectiveCard: RetrospectiveCard, newPosition: { x: number, y: number }) {
  retrospectiveCard.x = newPosition.x;
  retrospectiveCard.y = newPosition.y;
  retrospectiveCard.isCurrentlyDragged = false;
  return updateCard(retrospectiveCard);
}

function updateDraggingState(retrospectiveCard: RetrospectiveCard, isDragged: boolean) {
  retrospectiveCard.isCurrentlyDragged = isDragged;
  return updateCard(retrospectiveCard);
}

function addRetrospectiveCard(retrospectiveCard: RetrospectiveCard) {
  retrospectiveCard.x = Math.random() * window.innerWidth;
  retrospectiveCard.y = Math.random() * window.innerHeight;
  return set(child(databaseReference, `circlePositions/${retrospectiveCard.id}`), retrospectiveCard);
}

function updateTitle(retrospectiveCard: RetrospectiveCard, title: string) {
  retrospectiveCard.title = title;
  return updateCard(retrospectiveCard);
}

function updateText(retrospectiveCard: RetrospectiveCard, text: string) {
  retrospectiveCard.text = text;
  return updateCard(retrospectiveCard);
}

function updateColor(retrospectiveCard: RetrospectiveCard, color: string) {
  retrospectiveCard.color = color;
  return updateCard(retrospectiveCard);
}

function updatePosition(retrospectiveCard: RetrospectiveCard, position: { x: number, y: number }) {
  retrospectiveCard.x = position.x;
  retrospectiveCard.y = position.y;
  return updateCard(retrospectiveCard);
}

function updateSize(retrospectiveCard: RetrospectiveCard, size: { height: number, width: number }) {
  retrospectiveCard.height = size.height;
  retrospectiveCard.width = size.width;
  return updateCard(retrospectiveCard);
}

function deleteRetrospectiveCard(retrospectiveCard: RetrospectiveCard) {
  return set(child(databaseReference, `circlePositions/${retrospectiveCard.id}`), null);
}

function updateZIndex(retrospectiveCard: RetrospectiveCard, zIndex: number) {
  retrospectiveCard.topZ = zIndex; // Assuming "topZ" is intended here
  return updateCard(retrospectiveCard);
}

function updateTopZIndex(zIndex: number) {
  return set(child(databaseReference, 'topZIndex'), zIndex);
}

function updateBottomZIndex(zIndex: number) {
  return set(child(databaseReference, 'bottomZIndex'), zIndex);
}

async function getTopZIndex() {
  const snapshot = await get(child(databaseReference, 'topZIndex'));
  return snapshot.exists() ? snapshot.val() : 0;
}

async function getBottomZIndex() {
  const snapshot = await get(child(databaseReference, 'bottomZIndex'));
  return snapshot.exists() ? snapshot.val() : -1;
}

function removeCard(card: RetrospectiveCard) {
  retrospectiveCards.update(cards => cards.filter(c => c.id !== card.id));
  const cardRef = child(databaseReference, 'circlePositions/' + card.id);
  remove(cardRef);
}

fetchInitialPositions();
listenToCardPositions();

export {
  retrospectiveCards,
  updateRetrospectiveCardPosition,
  updateDraggingState,
  addRetrospectiveCard,
  updateTitle,
  updateText,
  updateColor,
  updatePosition,
  updateSize,
  deleteRetrospectiveCard,
  updateZIndex,
  updateTopZIndex,
  updateBottomZIndex,
  getTopZIndex,
  getBottomZIndex,
};