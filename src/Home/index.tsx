import { useEffect, useState } from 'react';
import { Alert, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Participant } from '../components/Participant';
import { styles } from './styles';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
interface Props {
  id: string;
  participantName: string;
}

export function Home() {
  const [participants, setParticipants] = useState<Props[]>([]);
  const [participantName, setParticipantName] = useState('')
  const [date, setDate] = useState('');
  const { getItem, setItem } = useAsyncStorage("@contextmenu");

  async function handleParticipantAdd() {
    const id = uuid.v4();

    const newParticipant = { //SCHEMA
      id,
      participantName,
    }

    if (participantName.trim() === '') {
      return Alert.alert('Nome inválido', 'Digite um nome válido')
    }

    try {
      if (newParticipant.participantName.length > 0) {
        const response = await getItem();
        const previousData = response ? JSON.parse(response) : [];

        const data = [...previousData, newParticipant];

        await setItem(JSON.stringify(data));
      }
    } catch (error) {
      console.log(error);
    }
    setParticipantName('');
    handleShowTag();
  }

  async function handleShowTag() {

    try {
      const response = await getItem();
      const data = response ? JSON.parse(response) : [];

      setParticipants(data);

    } catch (error) {
      console.log(error);
    }
    setParticipantName('');
  }

  async function handleRemove(id: string) {
    const response = await getItem();
    const previousData = response ? JSON.parse(response) : [];

    const data = previousData.filter((item: Props) => item.id !== id);
    setItem(JSON.stringify(data));
    handleShowTag();
  }

  async function handleParticipantRemove(name: string, id: string) {
    Alert.alert('Remover participante', `Deseja remover ${name} da lista de presença?`, [
      {
        text: 'Sim',
        onPress: () => handleRemove(id)
      },
      {
        text: 'Não',
        style: 'cancel'
      }
    ])
  }
  function getDate() {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    const weekDay = date.getDay();
    const weekDayName = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const monthName = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    setDate(`${weekDayName.at(weekDay)}, ${day} de ${monthName.at(month)} de ${year} `)
  }
  useEffect(() => {
    getDate()
    handleShowTag();
  }, []);

  return (
    <View style={styles.container}>

      <Text style={styles.eventName}>
        Nome do Evento
      </Text>

      <Text style={styles.eventDate}>
        {date}
      </Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder='Nome do participante'
          placeholderTextColor='#6b6b6b'
          onChangeText={setParticipantName}
          value={participantName}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleParticipantAdd}
        >
          <Text style={styles.buttonText}>
            +
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        showsHorizontalScrollIndicator={false}
        data={participants}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Participant
            key={item.id}
            name={item.participantName}
            onRemove={() => handleParticipantRemove(item.participantName, item.id)} />
        )}
        ListEmptyComponent={() => (
          <Text style={styles.emptyList}>
            Nenhum participante adicionado a lista de presença
          </Text>
        )}
      />
    </View>
  );
}
