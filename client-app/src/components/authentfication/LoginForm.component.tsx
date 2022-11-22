import { observer } from "mobx-react-lite";
import { useMobXStore } from "../../app/stores/root.store";

import {ErrorMessage, Form, Formik} from "formik";
import TextInput from "../form/FormTextInput.component";
import {Button, Container, Label} from "semantic-ui-react";

const LoginForm = () => {
    const { userStore } = useMobXStore();

    return (
        <Container style={{marginTop: '6rem'}}>
            <Formik initialValues={{
                email: '',
                password: '',
                error: null,
            }} onSubmit={(values, { setErrors }) =>
                userStore.login(values).catch(_ =>
                    setErrors({ error: 'Invalid e-mail or password' }))}
            >
                {({ handleSubmit, isSubmitting, errors }) => (
                    <Form className='ui form' onSubmit={handleSubmit}>
                        <TextInput name='email' placeholder={'Email'} />
                        <TextInput name='password' placeholder={'Password'} type='password' />
                        <ErrorMessage name='error' render={() => (
                            <Label
                            style={{marginBottom: '.7rem'}}
                            basic
                            color='red'
                            content={errors.error}
                            />)
                        }
                        />
                        <Button
                            fluid
                            positive
                            content='Login'
                            type='submit'
                            loading={isSubmitting}
                        />
                    </Form>
                )}
            </Formik>
        </Container>
    );
};

export default observer(LoginForm);