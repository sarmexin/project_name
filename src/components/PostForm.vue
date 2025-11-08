<template>
    <form @submit.prevent="createPost">
        <h4>Создание поста</h4>
        <input
        v-model="post.title"
        class="input"
        type="text"
        placeholder="Название"
        >
        <input
        v-model="post.body"
        class="input"
        type="text"
        placeholder="Описание поста"
        >
        <button class="btn" @click="createPost">
            Создать
        </button>
    </form>
</template>

<script>
export default {
    data() {
        return {
            post: {
                title: '',
                body: ''
            }
        }
    },
    methods: {
        createPost() {
             if (this.post.title && this.post.body) {
               this.$emit('create', {
                 id: Date.now(),
                 title: this.post.title,
                 body: this.post.body
               })
               this.post.title = ''
               this.post.body = ''
             }
        }
    }
}
</script>

<style scoped>
form {
    display: flex;
    flex-direction: column;
}

.input {
    width: 100%;
    border: 1px solid teal;
    padding: 10px 15px;
    margin-top: 15px;
}

.btn {
    margin-top: 15px;
    margin-bottom: 15px;
    align-self: flex-end;
    padding: 10px 15px;
    background: none;
    color: teal;
    border: 1px solid teal;
}
</style>

