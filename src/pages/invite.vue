<template>
    <div>
        <h1>{{ title }}</h1>
        <form @submit.prevent="submitForm">
            <div class="form-group">
                <label for="name">Name</label>
                <input type="text" id="name" name="name" v-model="formValues.name"
                    placeholder="Please enter your GitHub ID" />
            </div>
            <div class="form-group">
                <label for="additional">Additional Context</label>
                <textarea id="additional" name="additional" v-model="formValues.additional"></textarea>
            </div>
            <button class="btn btn-primary" type="submit" :disabled="!formIsValid">Submit</button>
        </form>
    </div>
</template>
  
<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import { token } from '../token'

interface FormValues {
    name: string
    additional: string
}

export default defineComponent({
    name: 'InviteForm',
    setup() {
        const formValues = reactive<FormValues>({
            name: '',
            additional: '',
        })

        const submitForm = async () => {
            const orgId = 'Magic-Academy'
            try {
                const response = await fetch(`https://api.github.com/users/${formValues.name}`, {
                    headers: {
                        Authorization: token,
                    },
                })

                if (!response.ok) {
                    throw new Error(`Failed to find user: ${response.status} ${response.statusText}`)
                }

                const user = await response.json()

                const invitationData = {
                    invitee_id: user.id,
                    role: 'direct_member',
                    teams: [], // invite the user without a team
                    message: formValues.additional,
                }

                const inviteResponse = await fetch(`https://api.github.com/orgs/${orgId}/invitations`, {
                    method: 'POST',
                    headers: {
                        Authorization: token,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(invitationData),
                })

                if (!inviteResponse.ok) {
                    throw new Error(`Failed to send invitation: ${inviteResponse.status} ${inviteResponse.statusText}`)
                }

                alert('Invitation sent successfully!')
                formValues.name = ''
                formValues.additional = ''
            } catch (error) {
                alert(`Failed to send invitation: ${error}`)
            }
        }

        const formIsValid = (): boolean => {
            return formValues.name.length > 0 && formValues.additional.length > 0
        }

        return {
            ...toRefs({ formValues }),
            submitForm,
            formIsValid,
        }
    },
    data() {
        return {
            title: 'Please invite me to the GitHub Community Organization',
        }
    },
})
</script>
  
  
<style scoped>
.form-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 1rem;
}

.form-group label {
    margin-bottom: 0.5rem;
}

.form-group input[type="text"],
.form-group textarea {
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
}

.form-group input[type="text"]:focus,
.form-group textarea:focus {
    outline: none;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}
</style>
  