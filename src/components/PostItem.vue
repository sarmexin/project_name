<template>
    <div class="post">
        <div><strong>номер</strong> {{ post.id }} </div>
        <div><strong>Название:</strong> {{ post.title }} </div>
        <div><strong>Описание</strong> {{ post.body }} </div>
    </div>
</template>

<script>
export default {
    props: {
        post: {
            type: Object,
            required: true
        }
    }
}
</script>

<style scoped>
.post {
    padding: 15px;
    border: 2px solid teal;
    margin-bottom: 15px;
}
</style>
