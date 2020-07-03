<template>
<div class="login-form">
    <h5 class="text-center">Chat Login</h5>
    <hr>
    <b-form @submit.prevent="onSubmit">
        <b-alert variant="danger" :show="hasError">{{ error }} </b-alert>

        <b-form-group id="userInputGroup" label="User Name" label-for="userInput">
            <b-form-input id="userInput" type="text" placeholder="Enter user name" v-model="userId" autocomplete="off" :disabled="loading" required>
            </b-form-input>
        </b-form-group>

        <b-button type="submit" variant="primary" class="buttonblue ld-ext-right" v-bind:class="{ running: loading }" :disabled="isValid">
            Login <div class="ld ld-ring ld-spin"></div>
        </b-button>
    </b-form>
</div>
</template>

<script>
import {
    mapState,
    mapGetters,
    mapActions
} from 'vuex'

export default {
    name: 'login-form',
    data() {
        return {
            userId: '',
        }
    },

    methods: {
        ...mapActions([
            'login'
        ]),
        async onSubmit() {
            const result = await this.login(this.userId);
            if (result) {
                this.$router.push('chat');
            }
        }
    },

    computed: {
        isValid: function () {
            const result = this.userId.length < 3;
            return result ? result : this.loading
        },
        ...mapState([
            'loading',
            'error'
        ]),
        ...mapGetters([
            'hasError'
        ])
    }
}
//#1fd4de!important;
</script>

<style>
    .buttonblue {
        background-color: #17a2b8 !important;
        border: 2px solid #17a2b8 !important;
    }
</style>

