import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React, { useEffect } from 'react';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/router';
import { ButtonSendSticker } from '../src/components/ButtonSendSticker'

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzI4NzE4NiwiZXhwIjoxOTU4ODYzMTg2fQ.4PdJ_8NvBPLi2Db0XH3ncULJhfNS3WLkzJ8oJIf2N0Y';
const SUPABASE_URL = 'https://pheyvmdhymnpqifbveqk.supabase.co'
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

function useLista() {
    const [listaDeMensagens, setListaDeMensagens] = React.useState([
    ]);

    return {
        listaDeMensagens,
        setListaDeMensagens
    }
}

function escutaMensagensTempoReal(adicionaMensagem) {
    return supabaseClient.from('mensagens').on('INSERT', (response) => {
        adicionaMensagem(response.new)
    }).subscribe();
}

export default function ChatPage() {
    const { listaDeMensagens, setListaDeMensagens } = useLista()
    const router = useRouter()
    const usuarioLogado = router.query.username;
    const [mensagem, setMensagem] = React.useState('');
    const iconeSend = <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
    </svg>

    useEffect(() => {
        supabaseClient
            .from('mensagens')
            .select('*')
            .order('id', { ascending: false })
            .then(({ data }) => {
                setListaDeMensagens(data)
            });

        escutaMensagensTempoReal((novaMensagem) => {
            setListaDeMensagens((valorAtual) => {
                return [
                    novaMensagem,
                    ...valorAtual,
                ]
            });
        });
        }, []);
    



        /*
        // Usuário
        - Usuário digita no campo textarea
        - Aperta enter para enviar
        - Tem que adicionar o texto na listagem
        
        // Dev
        - [X] Campo criado
        - [X] Vamos usar o onChange usa o useState (ter if pra caso seja enter pra limpar a variavel)
        - [X] Lista de mensagens 
        */
        function handleNovaMensagem(novaMensagem) {
            const mensagem = {
                // id: listaDeMensagens.length + 1,
                de: `${usuarioLogado}`,
                texto: novaMensagem,
            };

            supabaseClient
                .from('mensagens')
                .insert([
                    // tem que ser um objeto com os MESMOS CAMPOS que escreveu no supabase
                    mensagem
                ])
                .then(({ data }) => {
                    console.log('Criando mensagem', data)
                })

            setMensagem('');
        }



        return (
            <Box
                styleSheet={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: appConfig.theme.colors.primary[500],
                    backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
                    backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                    color: appConfig.theme.colors.neutrals['000']
                }}
            >
                <Box
                    styleSheet={{
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                        boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                        borderRadius: '5px',
                        backgroundColor: appConfig.theme.colors.neutrals[700],
                        height: '100%',
                        maxWidth: '95%',
                        maxHeight: '95vh',
                        padding: '32px',
                    }}
                >
                    <Header />
                    <Box
                        styleSheet={{
                            position: 'relative',
                            display: 'flex',
                            flex: 1,
                            height: '80%',
                            backgroundColor: appConfig.theme.colors.neutrals[600],
                            flexDirection: 'column',
                            borderRadius: '5px',
                            padding: '16px',
                        }}
                    >
                        <MessageList mensagens={listaDeMensagens}
                            onDelete={(id) => {
                                setListaDeMensagens(listaDeMensagens.filter((element) => {
                                    return element.id !== id
                                }))
                            }}
                        />


                        {/* {listaDeMensagens.map((mensagemAtual) => {
                        return (
                            <li key={mensagemAtual.id}>
                                {mensagemAtual.de}: {mensagemAtual.texto}
                            </li>
                        )
                    })} */}
                        <Box
                            as="form"
                            styleSheet={{
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <TextField
                                value={mensagem}
                                onChange={(event) => {
                                    const valor = event.target.value;
                                    setMensagem(valor);
                                }}
                                onKeyPress={(event) => {
                                    if (event.key === 'Enter') {
                                        event.preventDefault();
                                        handleNovaMensagem(mensagem);
                                    }
                                }}
                                placeholder="Insira sua mensagem aqui..."
                                type="textarea"
                                styleSheet={{
                                    width: '100%',
                                    border: '0',
                                    resize: 'none',
                                    borderRadius: '5px',
                                    padding: '6px 8px',
                                    backgroundColor: appConfig.theme.colors.neutrals[800],
                                    marginRight: '5px',
                                    color: appConfig.theme.colors.neutrals[200],
                                }}
                            >
                            </TextField>
                            <ButtonSendSticker onStickerClick={(sticker) => {
                                console.log('Salva ai ' + sticker)
                                handleNovaMensagem(':stickers:' + sticker)
                            }} />
                            <Button label='Send' colorVariant='positive' styleSheet={{marginLeft: '5px'}} onClick={() => {
                                handleNovaMensagem(mensagem);
                            }}>

                            </Button>
                            <Box>
                            </Box>

                        </Box>
                    </Box>
                </Box>
            </Box>
        )
    }

function Header() {
            return (
                <>
                    <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                        <Text variant='heading5'>
                            Chat
                        </Text>
                        <Button
                            variant='tertiary'
                            colorVariant='neutral'
                            label='Logout'
                            href="/"
                        />
                    </Box>
                </>
            )
        }

function MessageList(props) {

            useEffect(() => {
                supabaseClient
                    .from('mensagens')
                    .select('*')
                    .order('id', { ascending: false })
                    .then(({ data }) => {
                        setListaDeMensagens(data)
                    })
            }, [])

            const { listaDeMensagens, setListaDeMensagens } = useLista()

            console.log(props);
            return (
                <Box
                    tag="ul"
                    styleSheet={{
                        overflow: 'scroll',
                        display: 'flex',
                        flexDirection: 'column-reverse',
                        flex: 1,
                        color: appConfig.theme.colors.neutrals["000"],
                        marginBottom: '16px',
                    }}
                >
                    {props.mensagens.map((mensagem) => {
                        return (
                            <Text
                                onClick={() => {
                                    console.log()
                                }}
                                key={mensagem.id}
                                tag="li"
                                styleSheet={{
                                    borderRadius: '5px',
                                    padding: '6px',
                                    marginBottom: '12px',
                                    hover: {
                                        backgroundColor: appConfig.theme.colors.neutrals[700],
                                    }
                                }}
                            >
                                <Box
                                    styleSheet={{
                                        marginBottom: '8px',
                                    }}
                                >
                                    <Image
                                        styleSheet={{
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '50%',
                                            display: 'inline-block',
                                            marginRight: '8px',
                                        }}
                                        src={`https://github.com/${mensagem.de}.png`}
                                    />
                                    <Text tag="strong">
                                        {mensagem.de}
                                    </Text>
                                    <Text
                                        styleSheet={{
                                            fontSize: '10px',
                                            marginLeft: '8px',
                                            color: appConfig.theme.colors.neutrals[300],
                                        }}
                                        tag="span"
                                    >
                                        {(new Date().toLocaleDateString())}

                                        <Button label='x' styleSheet={{
                                            width: '10px',
                                            height: '10px',
                                            marginLeft: '5px'
                                        }} onClick={() => {
                                            props.onDelete(mensagem.id)
                                        }}
                                        />


                                    </Text>

                                </Box>
                                {/* {mensagem.texto.startsWith(':stickers:').toString()} */}
                                {mensagem.texto.startsWith(':stickers:') ? (
                                    <Image src={mensagem.texto.replace(':stickers:', '')} />
                                ) : (
                                    mensagem.texto
                                )}
                            </Text>
                        );
                    })}
                </Box>
            )
        }