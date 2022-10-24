import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';
import { useTheme } from 'styled-components';
import { 
    Container,
    Header,
    UserWrapper,
    UserInfo,
    Photo,
    User,
    UserGreeting,
    UserName,
    Icon,
    HighlightCards,
    Transactions,
    Title,
    TransactionList,
    LoadContainer
} from './styles';

export interface DataListProps extends TransactionCardProps {
    id: string;
}

interface HighlightProps {
    amount: string;
}

interface HighlightData {
    entries: HighlightProps;
    expenses: HighlightProps;
    total: HighlightProps;
}

export function Dashboard(){
    const [isLoading, setIsLoading] = useState(true);
    const [transactions, setTransactions] = useState<DataListProps[]>([]);
    const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);
    const theme = useTheme();

    async function loadTransactions(){
        const dataKey = "@gofinances:transactions";
        const response = await AsyncStorage.getItem(dataKey);
        const transactions = response ? JSON.parse(response) : [];
        let entriesTotal = 0;
        let expensesTotal = 0;

        const transactionsFormatted: DataListProps[] = transactions
        .map((item: DataListProps) => {

            if(item.type === 'positive'){
                entriesTotal += Number(item.amount);
            } else {
                expensesTotal += Number(item.amount);
            }

            const amount = Number(item.amount)
            .toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });
            const date = Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit'
            }).format(new Date(item.date));

            return {
                id: item.id,
                name: item.name,
                amount,
                type: item.type,
                category: item.category,
                date,
            }

        });

        const total = entriesTotal - expensesTotal;
        setTransactions(transactionsFormatted);
        setHighlightData({
            entries: {
                amount: entriesTotal.toLocaleString('pt-Br', {
                    style: 'currency',
                    currency: 'BRL'
                })
            },
            expenses: {
                amount: expensesTotal.toLocaleString('pt-Br', {
                    style: 'currency',
                    currency: 'BRL'
                })
            },
            total: {
                amount: total.toLocaleString('pt-Br', {
                    style: 'currency',
                    currency: 'BRL'
                })
            }
        });

        setIsLoading(false);
    }

    useEffect(() => {
        loadTransactions();
    }, []);

    useFocusEffect(useCallback(() => {
        loadTransactions();
    },[]));

    return(
        <Container>
            { 
                isLoading ? <LoadContainer>
                    <ActivityIndicator 
                        color={theme.colors.primary}
                        size="large"
                    />
                </LoadContainer> :
                <>
                    <Header>
                        <UserWrapper>
                            <UserInfo>
                                <Photo source={{ uri: 'https://avatars.githubusercontent.com/u/102862819?v=4' }}/>
                                <User>
                                    <UserGreeting>Olá,</UserGreeting>
                                    <UserName>André</UserName>
                                </User>
                            </UserInfo>
                                <Icon name="power"/>
                        </UserWrapper>            
                    </Header>

                    <HighlightCards>
                        <HighlightCard
                            type="up"
                            title="Entradas"
                            amount={highlightData.entries.amount}
                            lastTransaction="Última entrada dia 13 de abril"
                        />
                        <HighlightCard
                            type="down"
                            title="Saídas"
                            amount={highlightData.expenses.amount}
                            lastTransaction="Última saída dia 03 de abril"
                        />
                        <HighlightCard
                            type="total"
                            title="Total"
                            amount={highlightData.total.amount}
                            lastTransaction="01 à 16 de abril"
                        />
                    </HighlightCards>

                    <Transactions>
                        <Title>Listagem</Title>

                        <TransactionList
                            data={transactions}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => <TransactionCard data={item} />}
                        />

                    </Transactions>
                </>
            }
        </Container>
    )
}