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
        <my-button class="btn" style="align-self: flex-end; margin-top: 15px;" @click="createPost">
            Создать
        </my-button>
    </form>
</template>

<script>
import MyButton from "@/components/UI/MyButton.vue";

export default {
    components: {
        MyButton
    },
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
</style>

