<template>
    <div class="app">
        <post-form  @create="createPost"/>
        <post-list :posts="posts"/>
    </div>
</template>

<script>
import PostForm from "./components/PostForm";
import PostList from "@/components/PostList";

export default {
    components: {
        PostForm, PostList
    },
    data() {
        return {
            posts: [
                { id: 1, title: 'Пост о JavaScript', body: 'JavaScript универсальный язык программирования......' },
                { id: 2, title: 'Пост о Vue', body: 'Vue - JavaScript фреймворк' },
                { id: 3, title: 'Пост о React', body: 'React - JavaScript фреймворк' },
                { id: 4, title: 'Пост о PHP', body: 'PHP - серверный язык программирования' }
            ]
        }
    },
    methods: {
        createPost(post) {
            this.posts.push(post)
        }
    }
}

</script>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.app {
    padding: 100px;
}
</style>

