import { createContext, useReducer, useState } from 'react';
import axios from 'axios';
import { postReducer } from '../reducers/postReducer';
import {
    ADD_POST,
    apiUrl,
    DELETE_POST,
    POSTS_LOADED_FAIL,
    POSTS_LOADED_SUCCESS
} from './constants';

export const PostContext = createContext();

const PostContextProvider = ({ children }) => {
    const [postState, dispatch] = useReducer(postReducer, {
        posts: [],
        postsLoading: true
    });

    const [showAddPostModal, setShowAddPostModal] = useState(false);
    const [showToast, setShowToast] = useState({
        show: false,
        message: '',
        type: null
    });

    const getPosts = async () => {
        try {
            const response = await axios.get(`${apiUrl}/posts`);

            if (response.data.success) {
                dispatch({
                    type: POSTS_LOADED_SUCCESS,
                    payload: response.data.posts
                });
            }
        } catch (error) {
            dispatch({ type: POSTS_LOADED_FAIL });
        }
    };

    const addPost = async (newPost) => {
        try {
            const response = await axios.post(
                `${apiUrl}/posts/create`,
                newPost
            );
            if (response.data.success) {
                dispatch({ type: ADD_POST, payload: response.data.post });
                return response.data;
            }
        } catch (error) {
            return error.response.data
                ? error.response.data
                : { success: false, message: 'Server error' };
        }
    };

    const deletePost = async (postId) => {
        try {
            const response = await axios.delete(
                `${apiUrl}/posts/delete/${postId}`
            );
            if (response.data.success) {
                dispatch({ type: DELETE_POST, payload: postId });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const postContextData = {
        postState,
        getPosts,
        showAddPostModal,
        setShowAddPostModal,
        addPost,
        showToast,
        setShowToast,
        deletePost
    };

    return (
        <PostContext.Provider value={postContextData}>
            {children}
        </PostContext.Provider>
    );
};

export default PostContextProvider;
