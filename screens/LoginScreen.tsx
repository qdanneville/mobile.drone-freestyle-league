import { StackScreenProps } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { StyleSheet, TextInput, Button, Text, View } from "react-native";
import Colors from "../constants/Colors";

import { RootStackParamList } from "../types";
import { doLogin } from "../store/auth";


export default function LoginScreen({
  navigation,
}: StackScreenProps<RootStackParamList, "NotFound">) {

  const [identifier, setIdentifier] = useState("Username");
  const [password, setPassword] = useState("******");
  const [errors, setErrors] = useState(null);

  const dispatch = useDispatch();

  const handleSubmit = (e: Event) => {
    e.preventDefault();

    dispatch(doLogin(identifier, password)).catch((err: any) =>
      setErrors(err.message)
    );
  };

  console.log(identifier);
  console.log(password);
  console.log(errors);

  return (
    <View style={styles.container}>
      {errors &&<Text style={styles.title}>{errors}</Text>}
      <Text style={styles.title}>Login page</Text>
      <TextInput
        value={identifier}
        editable
        onChangeText={(text) => setIdentifier(text)}
        style={styles.input}
      />
      <TextInput
        value={password}
        editable
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
        style={styles.input2}
      />
      <Button title="Log in" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.dark.text,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  input: {
    marginTop: 15,
    border: "solid 2px white",
    paddingVertical: 15,
    paddingHorizontal: 10,
    color: Colors.dark.text,
    borderRadius: 6,
  },
  input2: {
    marginTop: 15,
    marginBottom: 15,
    border: "solid 2px white",
    paddingVertical: 15,
    paddingHorizontal: 10,
    color: Colors.dark.text,
    borderRadius: 6,
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
});
