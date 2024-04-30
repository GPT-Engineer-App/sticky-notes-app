import { useState } from "react";
import { Box, Button, Flex, Input, Text, VStack, useToast } from "@chakra-ui/react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { client } from "lib/crud";

const Index = () => {
  const [notes, setNotes] = useState([]);
  const [input, setInput] = useState("");
  const toast = useToast();

  const fetchNotes = async () => {
    const fetchedNotes = await client.getWithPrefix("note:");
    if (fetchedNotes) {
      setNotes(fetchedNotes.map((note) => ({ id: note.key, ...note.value })));
    }
  };

  const addNote = async () => {
    if (input.trim() === "") {
      toast({
        title: "Error",
        description: "Note can't be empty",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    const noteId = `note:${Date.now()}`;
    const success = await client.set(noteId, { text: input, createdAt: new Date().toISOString() });
    if (success) {
      setNotes([...notes, { id: noteId, text: input, createdAt: new Date().toISOString() }]);
      setInput("");
      toast({
        title: "Note added",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const deleteNote = async (id) => {
    const success = await client.delete(id);
    if (success) {
      setNotes(notes.filter((note) => note.id !== id));
      toast({
        title: "Note deleted",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={5}>
      <Flex mb={5}>
        <Input placeholder="Add a new note..." value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === "Enter" && addNote()} />
        <Button ml={2} onClick={addNote} colorScheme="teal">
          <FaPlus />
        </Button>
      </Flex>
      <VStack spacing={4}>
        {notes.map((note) => (
          <Flex key={note.id} p={4} w="100%" borderWidth="1px" borderRadius="lg" alignItems="center" justifyContent="space-between">
            <Text>{note.text}</Text>
            <Button onClick={() => deleteNote(note.id)} colorScheme="red">
              <FaTrash />
            </Button>
          </Flex>
        ))}
      </VStack>
    </Box>
  );
};

export default Index;
