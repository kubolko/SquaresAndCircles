<script lang="ts">
    import { onMount } from "svelte";
    import RetrospectiveCardComponent from "./components/RetrospectiveCard.svelte";
    import {
        addRetrospectiveCard,
        retrospectiveCards,
        getTopZIndex,
        getBottomZIndex,
    } from "./stores/FirebaseStore";
    import Overlay from "./components/Overlay.svelte";
    import { v4 as uuidv4 } from "uuid";
    import { RetrospectiveCard } from "./models/RetrospectiveCard";

    let topZ = 0;
    let bottomZ = 0;

    onMount(async () => {
        topZ = await getTopZIndex(); 
        bottomZ = await getBottomZIndex();
    });

    function getRandomColor() {
        const r = Math.floor(Math.random() * 256); // Random between 0-255
        const g = Math.floor(Math.random() * 256); // Random between 0-255
        const b = Math.floor(Math.random() * 256); // Random between 0-255
        return "rgb(" + r + "," + g + "," + b + ")"; // Collect all to a rgb string
    }

    function addSquare() {
        const newCard: RetrospectiveCard = {
            id: uuidv4(),
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            z: topZ++,
            title: Math.random().toString(36).substring(7),
            text: Math.random().toString(36).substring(7),
            color: getRandomColor(),
            isCurrentlyDragged: false,
            height: 250,
            width: 250, 
            topZ: topZ++,
            bottomZ: bottomZ,
        };

        console.log("New card:", newCard);

        retrospectiveCards.update((cards) => [...cards, newCard]);

        console.log("Adding card to Firebase...");

        addRetrospectiveCard(newCard)
            .then(() => {
                console.log("Card added to Firebase");
            })
            .catch((error) => {
                console.error("Error adding card to Firebase: ", error);
            });
    }

    function addCircle() {
        // code to add a circle
    }

    function remove() {
        // code to remove an element
    }
</script>

<div class="overlay-container">
    <Overlay {addSquare} {addCircle} {remove} />
</div>

{#each $retrospectiveCards as card (card.id)}
    <RetrospectiveCardComponent {card} />
{/each}
