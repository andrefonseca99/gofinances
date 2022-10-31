import React, { useContext } from 'react';
import { Alert } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

import { useAuth } from '../../hooks/auth';
import { SignInSocialButton } from '../../components/SignInSocialButton';
import AppleSvg from '../../assets/apple.svg';
import GoogleSvg from '../../assets/google.svg';
import LogoSvg from '../../assets/logo.svg';
import {
    Container,
    Header,
    TitleWrapper,
    Title,
    SignInTitle,
    Footer,
    FooterWrapper
} from './styles';

export function SignIn(){
    const { signInWithGoogle } = useAuth();

    async function handleSignInWithGoogle(){
        try {
            await signInWithGoogle();
        } catch (error) {
            console.log(error);
            Alert.alert('Não foi possível conectar a conta Google');
        }
    }

    return (
        <Container>
            <Header>
                <TitleWrapper>
                    <LogoSvg
                        width={RFValue(120)}
                        height={RFValue(68)}
                    />
                    <Title>
                        Contorle suas {'\n'}
                        finanças de forma {'\n'}
                        muito simples
                    </Title>
                </TitleWrapper>
                <SignInTitle>
                    Faça seu login com {'\n'}
                    uma das contas baixo
                </SignInTitle>
            </Header>

            <Footer>
                <FooterWrapper>
                <SignInSocialButton
                    title="Entrar com Google"
                    svg={GoogleSvg}
                    onPress={handleSignInWithGoogle}
                />
                <SignInSocialButton
                    title="Entrar com Apple"
                    svg={AppleSvg}
                />                
                </FooterWrapper>
            </Footer>
        </Container>
    );
}