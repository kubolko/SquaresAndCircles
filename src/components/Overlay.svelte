<script>
    export let addSquare;
    export let addCircle;
    export let remove;

    // Add more functions if needed
</script>

<style>
.overlay {
    display: flex;
    justify-content: space-around;
    padding: 10px 20px;
    background-color: #f0f0f0; /* Change this to your preferred color */
    border-radius: 25px; /* This creates the pill shape */
}

.button {
    padding: 10px;
    border: none;
    border-radius: 5px;
    background-color: #007BFF; /* Change this to your preferred color */
    color: white; /* Change this to your preferred color */
    cursor: pointer;
}
</style>

<div class="overlay">
    <button class="button" on:click={addSquare}>Add Square</button>
    <button class="button" on:click={addCircle}>Add Circle</button>
    <button class="button" on:click={remove}>Remove</button>
    <button class="button">Button 4</button>
    <button class="button">Button 5</button>
</div>