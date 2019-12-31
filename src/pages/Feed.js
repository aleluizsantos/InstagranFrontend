import React, { Component } from 'react';
import api from '../services/api';
import io from 'socket.io-client'

import './Feed.css';

import more from '../assets/more.svg';
import like from '../assets/like.svg';
import comment from '../assets/comment.svg';
import send from '../assets/send.svg';
import baseUrl from '../services/baseUrl'


class Feed extends Component {
    //Criar um Estado para armazenar as informações recebidas o api.get
    state = {
        feed: [],
    }

    //toda classe tem acesso a este metodo componentDidMount que toda vez que 
    //que o componente for montado em tela ele é chamado
    async componentDidMount(){
        this.registerToSocket();
        const response = await api.get('posts');
        this.setState({ feed: response.data });
    }

    registerToSocket = () => {
        
        const socket = io(baseUrl);
        
        socket.on('post', newPost => {
            this.setState({ feed: [newPost, ...this.state.feed] })
        })

        socket.on('like', likePost => {
            this.setState({ 
                feed: this.state.feed.map(post => 
                    post._id === likePost._id ? likePost : post    
                )
            });
        })

        // socket.on('del', delPost => {
        //     this.setState({ feed: delPost })
        // })

    }

    handleLike = id => {
        api.post(`/posts/${id}/like`)
    }

    render() {
        return (
            <section id="post-list">
            
                { this.state.feed.map(post => (
                    <article key={post._id}>
                    <header>
                        <div className="user-info">
                            <span> {post.author} </span>
                            <span className="place">  {post.place} </span>
                        </div>
                        <img src={more} alt="mais" />
                    </header>
                    <img src={`${baseUrl}/files/${post.image}`} alt="ingrid"/>

                    <footer>
                        <div className="actions">
                            <button type="button" onClick={() => this.handleLike(post._id)}> 
                                <img src={like} alt="mais" /> 
                            </button>
                            <img src={comment} alt="mais" />
                            <img src={send} alt="mais" />
                        </div>
                        <strong> {post.likes} Curtidas </strong>
                        <p>
                            {post.description}
                            <span>{post.hashtags}</span>
                        </p>
                    </footer>
                </article>
                ))}

            </section>
        );
    }
}

export default Feed;