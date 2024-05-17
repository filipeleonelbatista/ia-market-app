import { EvilIcons, Feather, FontAwesome, FontAwesome6, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { createRef, useEffect, useMemo, useState } from 'react';
import { Alert, Dimensions, FlatList, ImageBackground, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function App() {
  const [openModal, setOpenModal] = useState(false);
  const [isChatting, setIsChatting] = useState(false);
  const [list, setList] = useState([]);

  const carrocel = [
    {
      id: 1,
      img: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Super promoções no Mercado IA',
      subtitle: 'Promoções da semana'
    },
    {
      id: 2,
      img: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Fale com nosso atendente de IA',
      subtitle: 'Peça por uma receita e ele vai montar seu carrinho com as melhores promoções'
    },
    {
      id: 3,
      img: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Cartão exclusivo Mercado IA',
      subtitle: 'Cartão para aproveitar as melhores ofertas'
    },
  ]

  const categorias = [
    {
      id: 1,
      icon: <MaterialCommunityIcons name="fruit-watermelon" size={24} color="black" />,
      title: 'Fruteira',
    },
    {
      id: 2,
      icon: <Ionicons name="beer-outline" size={24} color="black" />,
      title: 'Bebidas',
    },
    {
      id: 3,
      icon: <FontAwesome name="shopping-basket" size={24} color="black" />,
      title: 'Mecearia',
    },
    {
      id: 4,
      icon: <MaterialCommunityIcons name="food-outline" size={24} color="black" />,
      title: 'Fast-food',
    },
    {
      id: 5,
      icon: <MaterialCommunityIcons name="food-turkey" size={24} color="black" />,
      title: 'Carnes',
    },
    {
      id: 6,
      icon: <FontAwesome6 name="bread-slice" size={24} color="black" />,
      title: 'Padaria',
    },
  ]

  const validationSchema = useMemo(() => Yup.object().shape({
    produto: Yup.string()
      .required('O nome do produto é obrigatório'),
    quantidade: Yup.number()
      .required('A quantidade é obrigatória')
      .positive('A quantidade deve ser maior que zero')
      .integer('A quantidade deve ser um número inteiro'),
    valor: Yup.string()
      .required('O valor é obrigatório')
  }), []);

  const formik = useFormik({
    initialValues: {
      produto: '',
      quantidade: '',
      valor: ''
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      const newItem = {
        id: list.length + 1,
        description: values.produto,
        uni: values.quantidade,
        amount: parseFloat(values.valor.replaceAll('.', '').replace(',', '.'))
      };
      setList([...list, newItem]);
      resetForm();
      setOpenModal(false);
    }
  });

  const flatListRef = createRef();

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % carrocel.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ index: activeIndex, animated: true });
    }
  }, [activeIndex]);

  function moeda(e) {
    let value = e;
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d)(\d{2})$/, "$1,$2");
    value = value.replace(/(?=(\d{3})+(\D))\B/g, ".");
    return value;
  }

  const formatCurrency = (value) => {
    return value
      .toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: true,
      })
  }

  const handleDelete = (id) => {
    Alert.alert(
      "Confirmação de Exclusão",
      "Você tem certeza que deseja remover este item?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => {
            setList(list.filter(item => item.id !== id));
          }
        }
      ]
    );
  };

  return (
    <View className="flex-1 pt-10 bg-white relative">
      <StatusBar style="dark" backgroundColor='#A5F2F3' />
      <View className="flex p-4 pt-6 bg-white border-b border-gray-300">
        <Text className="font-bold text-xl text-cyan-600">Mercado com IA</Text>
      </View>
      <View className="w-full flex p-1 bg-cyan-100 items-center justify-center">
        <Text>Experimente nosso assistente de compras com IA!</Text>
      </View>

      <View className="flex items-center">
        <FlatList
          ref={flatListRef}
          data={carrocel}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          style={{
            width: Dimensions.get("window").width - 32,
            height: 128,
            marginVertical: 8,
          }}
          renderItem={({ item }) => (
            <ImageBackground
              source={{ uri: item.img }}
              style={{
                width: Dimensions.get("window").width - 32,
                position: 'relative'
              }}>
              <View className="bg-slate-900/60 p-2 h-full w-full">
                <Text className="text-xl font-bold text-white">{item.title}</Text>
                <Text className="text-md text-white">{item.subtitle}</Text>
              </View>
            </ImageBackground>
          )}
        />
      </View>

      <View className="flex flex-col px-4">
        <Text className="text-xl font-bold">Compre agora</Text>
        <FlatList
          data={categorias}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
          renderItem={({ item }) => (
            <View className="h-full my-4">
              <TouchableOpacity className="flex flex-col gap-2 items-center">
                <View className="w-14 h-14 rounded-full bg-cyan-200 flex items-center justify-center">
                  {item.icon}
                </View>
                <Text className="text-md">{item.title}</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      {
        openModal && (
          <View className="absolute z-10 left-0 right-0 bottom-0 bg-gray-900/80 blur-xl w-full h-full flex justify-center items-center p-6">
            <View className="flex flex-col w-full items-center rounded-md bg-white p-5 space-y-4">
              <Text className="font-bold text-gray-900 text-2xl">Adicionar item</Text>

              <View className='flex flex-col w-full'>
                <Text className="font-semibold text-gray-700 text-xl">Produto</Text>
                <TextInput
                  className="border bg-white rounded-md w-full p-2 text-gray-950 text-md"
                  placeholder='Digite o nome do produto...'
                  onChangeText={formik.handleChange('produto')}
                  value={formik.values.produto}
                />
                {formik.touched.produto && formik.errors.produto ? (
                  <Text className="text-red-600">{formik.errors.produto}</Text>
                ) : null}
              </View>

              <View className='flex flex-col w-full'>
                <Text className="font-semibold text-gray-700 text-xl">Quantidade</Text>
                <TextInput
                  keyboardType='numeric'
                  className="border bg-white rounded-md w-full p-2 text-gray-950 text-md"
                  placeholder='Digite a quantidade...'
                  onChangeText={formik.handleChange('quantidade')}
                  value={formik.values.quantidade}
                />
                {formik.touched.quantidade && formik.errors.quantidade ? (
                  <Text className="text-red-600">{formik.errors.quantidade}</Text>
                ) : null}
              </View>

              <View className='flex flex-col w-full'>
                <Text className="font-semibold text-gray-700 text-xl">Valor</Text>
                <TextInput
                  keyboardType='numeric'
                  className="border bg-white rounded-md w-full p-2 text-gray-950 text-md"
                  placeholder='Digite o valor...'
                  onChangeText={(text) => formik.setFieldValue('valor', moeda(text))}
                  value={formik.values.valor}
                />
                {formik.touched.valor && formik.errors.valor ? (
                  <Text className="text-red-600">{formik.errors.valor}</Text>
                ) : null}
              </View>

              <TouchableOpacity
                className="rounded-lg w-full bg-green-600 p-3 flex items-center justify-center"
                onPress={formik.handleSubmit}
              >
                <Text className="text-center uppercase font-semibold text-white">Adicionar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="rounded-lg w-full border-2 bg-white border-red-600 p-3 flex items-center justify-center"
                onPress={() => setOpenModal(false)}
              >
                <Text className="text-center uppercase font-semibold text-red-600">Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )
      }

      <View className="flex w-full items-center flex-col px-4 gap-4">
        <View className="flex flex-row w-full px-2 items-center justify-between">
          <Text className="text-xl font-bold">Sua lista de compras</Text>

          <TouchableOpacity onPress={() => setOpenModal(true)} className="flex flex-row gap-1 items-center">
            <Feather name="plus" color="#0891b2" size={20} />
            <Text className="uppercase text-cyan-500">Adicionar</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={list}
          style={{
            height: 380,
          }}
          ListEmptyComponent={() => (
            <View className="flex flex-col items-center p-10 gap-4">
              <View className="w-14 h-14 rounded-full bg-cyan-200 flex items-center justify-center">
                <AntDesign name="file1" size={24} color="black" />
              </View>
              <Text className="text-xl font-bold text-center">Você não tem items disponíveis ainda!</Text>
              <Text className="text-md text-center">Adicione manualmente um item ou fale com o assistente de IA para adicionar items a lista</Text>
            </View>
          )}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          renderItem={({ item }) => (
            <View className="w-full flex flex-row items-center justify-between p-4 rounded-md border border-gray-400">
              <View>
                <Text className="text-xl font-bold">{item.description}</Text>
                <Text>Qtd:. {item.uni} Valor: {formatCurrency(item.amount)}</Text>
                <Text className="text-md font-bold">Total: {formatCurrency(item.uni * item.amount)}</Text>
              </View>
              <TouchableOpacity onPress={() => handleDelete(item.id)} >
                <Feather name="trash" color="red" size={24} />
              </TouchableOpacity>
            </View>
          )}
        />

      </View>

      {
        !isChatting ? (
          <TouchableOpacity onPress={() => setIsChatting(true)} className="absolute bottom-6 right-6 w-16 h-16 bg-cyan-600 rounded-full flex items-center justify-center">
            <Text className="font-bold text-2xl text-white">+</Text>
          </TouchableOpacity>
        ) : (
          <View className="absolute bottom-0 bg-gray-900/80 blur-xl w-full h-full flex justify-end p-4 space-y-4">
            <View className="flex flex-row gap-4">
              <View className="w-14 h-14 bg-cyan-200 rounded-full flex items-center justify-center">
                <Text>
                  <Feather name="user" size={24} color="black" />
                </Text>
              </View>
              <View className="p-4 w-9/12 rounded-md bg-cyan-100 flex">
                <Text>
                  Olá, Gostaria de fazer um churrasco para 20 pessoas.
                  O que eu preciso comprar para esse evento?
                  {/* Com quantos kilos de carne da pra 20 comer? */}
                </Text>
              </View>
            </View>

            <View className="flex flex-row-reverse gap-4">
              <View className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center">
                <Text>
                  <MaterialCommunityIcons name="robot-happy-outline" size={24} color="black" />
                </Text>
              </View>
              <View className="p-4 w-9/12 rounded-md bg-gray-100 flex">
                <Text>
                  Legal, um desafio e tanto fazer um churrasco para um grupo grande de pessoas!
                  {"\n\n"}
                  Cada pessoa costuma comer em média 300g de carne então para fazer seu churrasco sugiro o seguinte:
                  {"\n\n"}
                  * Carne 4kg
                  {"\n"}
                  * Salsichão 1kg
                  {"\n"}
                  * Pão de alho
                  {"\n"}
                  * Coração de frango 1kg
                  {"\n"}
                  * Coxinha da asa 1.5kg
                  {"\n"}
                  * Carvão 5kg
                  {"\n"}
                  * Tempero para carne
                  {"\n"}
                  * Fosforo
                  {"\n\n"}
                  Com isso acredito que dê para 20 pessoas comerem bem no seu evento. Se precisar de mais só pedir neste chat! 😉
                </Text>
              </View>
            </View>

            <View className="flex flex-row gap-4 justify-center">
              <TouchableOpacity className="rounded-lg w-5/12 bg-green-600 p-4 flex items-center justify-center">
                <Text className="text-center font-semibold text-white">Adicionar a lista</Text>
              </TouchableOpacity>
              <TouchableOpacity className="rounded-lg w-5/12 border-2 bg-gray-200 border-red-600  p-4 flex items-center justify-center">
                <Text className="text-center font-semibold text-red-600">Ignorar a lista</Text>
              </TouchableOpacity>
            </View>

            <View className="flex flex-row gap-2">
              <EvilIcons name="spinner-3" size={24} color="white" />
              <Text className="text-white font-semibold">A IA está digitando...</Text>
            </View>

            <View className="flex flex-row items-center relative">
              <TextInput
                className="border bg-white rounded-full w-full p-4 text-gray-950 text-md"
                placeholder='Pergunte para nossa Inteligência artificial...'
              />
              <TouchableOpacity onPress={() => setIsChatting(false)} className="absolute right-2 w-12 h-12 bg-cyan-600 rounded-full flex items-center justify-center">
                <Text className="font-bold text-2xl text-white">
                  <MaterialIcons name="send" size={24} color="white" />
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )
      }
    </View>
  );
}
