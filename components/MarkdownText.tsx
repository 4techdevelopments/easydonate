// components/MarkdownText.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colors from './Colors';

interface MarkdownTextProps {
  content: string;
}

const MarkdownText: React.FC<MarkdownTextProps> = ({ content }) => {
  // Quebra o texto em um array de linhas e remove espaços extras
  const lines = content.trim().split('\n');

  return (
    <View>
      {lines.map((line, index) => {
        // Remove espaços em branco do início e fim da linha
        const trimmedLine = line.trim();

        // Se a linha começar com '## ', é um subtítulo
        if (trimmedLine.startsWith('## ')) {
          return (
            <Text key={index} style={styles.h2}>
              {trimmedLine.substring(3)}
            </Text>
          );
        }
        // Se a linha começar com '# ', é um título principal
        if (trimmedLine.startsWith('# ')) {
          return (
            <Text key={index} style={styles.h1}>
              {trimmedLine.substring(2)}
            </Text>
          );
        }
        // Se a linha começar com '- ', é um item de lista
        if (trimmedLine.startsWith('- ')) {
          return (
            <View key={index} style={styles.listItemContainer}>
              <Text style={styles.listItemBullet}>
                •
              </Text>
              <Text style={styles.paragraph}>
                {trimmedLine.substring(2)}
              </Text>
            </View>
          );
        }
        // Se a linha for vazia, cria um espaço
        if (trimmedLine === '') {
            return <View key={index} style={{ height: 10 }} />;
        }
        // Senão, é um parágrafo normal
        return (
          <Text key={index} style={styles.paragraph}>
            {trimmedLine}
          </Text>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  h1: {
    fontSize: 17,
    fontFamily: 'Montserrat-Bold',
    color: Colors.BLACK,
    marginBottom: 15,
    marginTop: 10,
  },
  h2: {
    fontSize: 15,
    fontFamily: 'Montserrat-Bold',
    color: Colors.ORANGE,
    marginBottom: 10,
    marginTop: 8,
  },
  paragraph: {
    fontSize: 14,
    fontFamily: 'Montserrat',
    color: '#333',
    lineHeight: 22,
    marginBottom: 10,
    flexShrink: 1,
  },
  listItemContainer: {
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'flex-start',
  },
  listItemBullet: {
      marginRight: 8,
      fontSize: 14,
      lineHeight: 22,
      color: '#333',
  }
});

export default MarkdownText;