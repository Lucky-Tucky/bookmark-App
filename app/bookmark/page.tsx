"use client";
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import React, { useEffect, useState } from 'react';

interface Bookmark {
    id: number;
    title: string;
    created_at: string;
    url: string;
}
const initialBookmarks: Bookmark[] = [];

export default function BookMarkList() {

    const router = useRouter();
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newUrl, setNewUrl] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [bookmarkToDelete, setBookmarkToDelete] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    const hasBookmarks = bookmarks.length > 0;

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.replace('/');
    };

    const handleAddBookmark = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newTitle && newUrl && user) {
            const { error } = await supabase
                .from("bookmarks")
                .insert({ title: newTitle, url: newUrl, user_id: user.id }).single();

            if (error) {
                console.error("Error adding bookmark:", error);
            }
            setIsModalOpen(false);
            setNewTitle('');
            setNewUrl('');
        }
    };

    const handleDeleteClick = (id: number) => {
        setBookmarkToDelete(id);
        setIsDeleteModalOpen(true);
    };


    const handleConfirmDelete = async () => {
        if (bookmarkToDelete !== null && user) {
            const { error } = await supabase.from("bookmarks")
                .delete()
                .eq("user_id", user.id)
                .eq("id", bookmarkToDelete).single();
            if (error) {
                console.error("Error deleting bookmark:", error);
            }
            setIsDeleteModalOpen(false);
            setBookmarkToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
        setBookmarkToDelete(null);
    };
    
    useEffect(() => {
        const getAndSetSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            setIsLoading(false); // Initial auth check is done
        };

        getAndSetSession();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        const userId = user?.id;

        if (userId) {
            const fetchBookmarks = async () => {
                const { data, error } = await supabase
                    .from("bookmarks")
                    .select("*")
                    .eq("user_id", userId)
                    .order('created_at', { ascending: false });
                if (error) {
                    console.error("Error fetching bookmarks:", error);
                } else {
                    setBookmarks(data || []);
                }
            };

            fetchBookmarks();

            const channel = supabase
                .channel(`realtime-bookmarks-for-user-${userId}`)
                .on('postgres_changes', { event: '*', schema: 'public', table: 'bookmarks' },
                    () => fetchBookmarks()
                ).subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [user?.id]);

    useEffect(() => {
        if (!isLoading && !user) {
            router.replace('/');
        }
    }, [isLoading, user, router]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-white">
                <p className="text-lg text-gray-500">Loading...</p>
            </div>
        );
    }

    return (
        <div className="relative bg-white min-h-screen font-sans pb-12">
            <header className="p-4 border-b">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <a href="https://github.com/Lakshay-Chauhan-129/bookmark-App" target="_blank" rel="noopener noreferrer" aria-label="GitHub Repository">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-gray-600 hover:text-gray-900 transition-colors">
                                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                            </svg>
                        </a>
                        {hasBookmarks &&
                            <button onClick={() => setIsModalOpen(true)} className="text-blue-500 bg-white border border-blue-500 py-2 px-4 rounded hover:bg-blue-500 hover:text-white transition-colors duration-300">
                                Create new book mark
                            </button>}
                    </div>
                    <button onClick={handleLogout} className="text-gray-700 bg-white border border-gray-300 py-2 px-4 rounded hover:bg-gray-50 transition-colors duration-300">
                        Logout
                    </button>
                </div>
            </header>

            <main className="p-8">
                {hasBookmarks ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white shadow-md rounded-lg">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                                    <th className="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Delete</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {bookmarks.map((bookmark) => (
                                    <tr key={bookmark.id} className="hover:bg-gray-50">
                                        <td className="py-4 px-6 whitespace-nowrap">{bookmark.title}</td>
                                        <td className="py-4 px-6 whitespace-nowrap text-blue-600 hover:underline"><a href={bookmark.url} target="_blank" rel="noopener noreferrer">{bookmark.url}</a></td>
                                        <td className="py-4 px-6 whitespace-nowrap">{new Date(bookmark.created_at).toLocaleString()}</td>
                                        <td className="py-4 px-6 text-center"><button onClick={() => handleDeleteClick(bookmark.id)} className="text-red-600 hover:text-red-900">Delete</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex flex-col justify-center items-center h-[80vh] space-y-4">
                        <p className="text-lg text-gray-500">There is no data on the screen.</p>
                        <button onClick={() => setIsModalOpen(true)} className="text-blue-500 bg-white border border-blue-500 py-2 px-4 rounded hover:bg-blue-500 hover:text-white transition-colors duration-300">
                            Create new bookmark
                        </button>
                    </div>
                )}
            </main>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Create Bookmark</h2>
                        <form onSubmit={handleAddBookmark}>
                            <div className="mb-4">
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="url" className="block text-sm font-medium text-gray-700">URL</label>
                                <input
                                    type="url"
                                    id="url"
                                    value={newUrl}
                                    onChange={(e) => setNewUrl(e.target.value)}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-700 bg-white border border-gray-300 py-2 px-4 rounded hover:bg-gray-50 transition-colors duration-300">Cancel</button>
                                <button type="submit" className="text-blue-500 bg-white border border-blue-500 py-2 px-4 rounded hover:bg-blue-500 hover:text-white transition-colors duration-300">Add</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
                        <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
                        <p className="text-gray-600 mb-6">Are you sure you want to delete this bookmark?</p>
                        <div className="flex justify-end space-x-2">
                            <button type="button" onClick={handleCancelDelete} className="text-gray-700 bg-white border border-gray-300 py-2 px-4 rounded hover:bg-gray-50 transition-colors duration-300">
                                Cancel
                            </button>
                            <button type="button" onClick={handleConfirmDelete} className="text-white bg-red-600 border border-red-600 py-2 px-4 rounded hover:bg-red-700 transition-colors duration-300">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <footer className="absolute bottom-4 left-1/2 -translate-x-1/2 text-gray-600 text-sm">
                Created by lakshaychauhan129@gmail.com
            </footer>
        </div>
    );
}
