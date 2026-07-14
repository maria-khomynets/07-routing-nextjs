// Усю клієнтську логіку(отримання списку нотаток
//     за допомогою useQuery та їх відображення)
//      винесіть в окремий файл компонента app / notes / Notes.client.tsx.
"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import { useDebouncedCallback } from "use-debounce";
import css from "./NotesPage.module.css";
import { fetchNotes, queryKey } from "@/lib/api";
import { useState } from "react";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import Loader from "@/components/Loader/Loader";
import Pagination from "@/components/Pagination/Pagination";
import { Toaster } from "react-hot-toast";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import TagSelector from "@/components/TagSelector/TagSelector";
export default function NotesClient() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [tag, setTag] = useState("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const handleSearch = useDebouncedCallback((search: string) => {
    setSearch(search);
    setCurrentPage(1);
  }, 1000);
  const handleTagChange = (value: string) => {
    setTag(value);
    setCurrentPage(1);
  };
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: [queryKey, search, tag, currentPage], //пагінація
    queryFn: () => fetchNotes({ search: search, tag, page: currentPage }),
    placeholderData: keepPreviousData,
  });
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={handleSearch} />
        <TagSelector value={tag} onChange={handleTagChange} />
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
        <button onClick={openModal} className={css.button}>
          Create note +
        </button>
      </header>
      {isError && <ErrorMessage />}
      {(isLoading || isFetching) && <Loader />}
      {!isLoading && !isError && data?.notes.length === 0 && (
        <p>No notes found.</p>
      )}
      {data?.notes.length ? <NoteList notes={data.notes} /> : null}
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onCancel={closeModal} onSuccess={closeModal} />
        </Modal>
      )}
      <Toaster />
    </div>
  );
}
