import { createContext, useReducer, useState } from 'react';
import axios from 'axios';
import { postReducer } from '../reducers/postReducer';
import { apiUrl, POSTS_LOADED_FAIL, POSTS_LOADED_SUCCESS } from './constants';

export const PostContext = createContext();

const PostContextProvider = ({ children }) => {
    const [postState, dispatch] = useReducer(postReducer, {
        posts: [],
        postsLoading: true
    });

    const [showAddPostModal, setShowAddPostModal] = useState(false);

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

    const postContextData = {
        postState,
        getPosts,
        showAddPostModal,
        setShowAddPostModal
    };

    return (
        <PostContext.Provider value={postContextData}>
            {children}
        </PostContext.Provider>
    );
};

export default PostContextProvider;
