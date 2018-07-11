import Vue from 'vue'
import axios from 'axios';
import VueAxios from 'vue-axios';


import VeeValidate from 'vee-validate';
import { Validator } from 'vee-validate';
Vue.use(VueAxios, axios);


Vue.use(VeeValidate);

const app = new Vue({
    el: '#app',
    data(){
        return {
            name: '',
            email: '',
            message: '',
            myEmail: 'simanaitis.tomas@gmail.com',
            success: ''
        }
    },
    methods:{
        sendEmail(e){
            this.$validator.validateAll().then((result) => {
                if (result) {

                    this.success = 'Sending';
                    e.target.setAttribute('disabled', true);

                    this.axios.post('https://formspree.io/' + this.myEmail, {
                        name: this.name,
                        email: this.email,
                        message: this.message
                    }).then(() => {
                       this.success = 'Thank You for your message!';
                        e.target.removeAttribute('disabled');
                        this.name = ''; this.message = ''; this.email = '';
                        let vm = this;
                        this.$nextTick(() => {
                            vm.$validator.clean();
                        });
                    })
                }
            });
        }
    }
});

const dictionary = {
    en: {
        messages:{
            required: () => 'This field is required',
            numeric: () => 'This field may only contain numbers',
            email: () => 'This email is invalid'
        }
    },
};

Validator.updateDictionary(dictionary);