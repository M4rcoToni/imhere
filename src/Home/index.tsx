import { Text, TextInput, View } from 'react-native';
import { styles } from './styles';

export function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.eventName}>
        Nome do Evento
      </Text>
      <Text style={styles.eventDate}>
        Segunda, 27 de Março de 2023
      </Text>
      <TextInput
        placeholder='Nome do participante'
        placeholderTextColor='#6b6b6b'
        style={styles.input}
      />
    </View>
  );
}
