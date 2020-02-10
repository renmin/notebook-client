import React, { Component } from 'react'
import axios from 'axios'
import {
    Button,
    Input,
    List,
    Avatar,
    Card,
} from 'antd';

import './App.css';

class App extends Component {
    state = {
        data: [],
        id: 0,
        message: null,
        intervalIsSet: false,
        idToDelete: null,
        idToUpdate: null,
        objectToUpdate: null,
    };

    componentDidMount() {
        this.getDataFromDb();
        if (!this.state.intervalIsSet) {
            let interval = setInterval(this.getDataFromDb, 1000);
            this.setState({ intervalIsSet: interval });
        }
    }

    componentWillUnmount() {
        if (this.state.intervalIsSet) {
            clearInterval(this.state.intervalIsSet);
            this.setState({ intervalIsSet: null });
        }
    }

    getDataFromDb = () => {
        fetch("api/getData")
            .then(data => data.json())
            .then(res => this.setState({ data: res.data }));
    };

    putDataToDB = message => {
        let currentIds = this.state.data.map(data => data.id);
        let idToBeAdded = 0;
        while (currentIds.includes(idToBeAdded)) {
            ++idToBeAdded;
        }
        axios.post("/api/putData", {
            id: idToBeAdded,
            message: message
        });
    };

    deleteFromDB = idToDelete => {
        let objIdToDelete = null;
        this.state.data.forEach(dat => {
            if (dat.id === idToDelete) {
                objIdToDelete = dat._id;
            }
        });

        axios.delete("/api/deleteData", {
            data: {
                id: objIdToDelete
            }
        });
    }

    updateDB = (idToUpdate, updateToApply) => {
        let objIdToUpdate = null;
        this.state.data.forEach(dat => {
            if (dat.id === idToUpdate) {
                objIdToUpdate = dat._id;
            }
        });

        axios.post("/api/updateData", {
            id: objIdToUpdate,
            update: { message: updateToApply }
        });
    }

    render() {
        const { data = [] } = this.state;
        console.log('data', data);
        return (
            <div style={{ width: 990, margin: 20 }}>
                <List
                    itemLayout="horizontal"
                    dataSource={data}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar src="https://gw.alicdn.com/tfs/TB1Hup.wa6qK1RjSZFmXXX0PFXa-1024-1024.jpg" />}
                                title={<span>{`创建时间：${item.createdAt}`}</span>}
                                description={`${item.id}:${item.message}`}
                            />
                        </List.Item>
                    )}
                />
                <Card
                    title="新增笔记"
                    style={{ padding: 10, margin: 10 }}
                >
                    <Input
                        onChange={e => this.setState({ message: e.target.value })}
                        placeholder="请输入笔记内容"
                        style={{ width: 200 }}
                    />
                    <Button
                        type="primary"
                        style={{ margin: 20 }}
                        onClick={() => this.putDataToDB(this.state.message)}
                    >添加</Button>
                </Card>
                <Card
                    title="删除笔记"
                    style={{ padding: 10, margin: 10 }}
                >
                    <Input
                        style={{width:200}}
                        onChange={e=> this.setState({idToDelete: e.target.value})}
                        placeholder="填写需要删除的ID" />
                    <Button
                        type="primary"
                        style={{margin:20}}
                        onClick={()=> this.deleteFromDB(this.state.idToDelete)}
                    >删除</Button>
                </Card>
                <Card
                    title="更新笔记"
                    style={{ padding: 10, margin: 10 }}
                >
                    <Input
                        onChange={e => this.setState({ idToUpdate: e.target.value })}
                        placeholder="所需更新的ID"
                        style={{ width: 200, marginRight: 10}}
                    />
                    <Input
                        onChange={e => this.setState({ updateToApply: e.target.value })}
                        placeholder="请输入所需更新的笔记内容"
                        style={{ width: 200}}
                    />
                    <Button
                        type="primary"
                        style={{ margin: 20 }}
                        onClick={() => 
                            this.updateDB(this.state.idToUpdate,this.state.updateToApply)}
                    >更新</Button>
                </Card>
            </div>
        );
    }
}
export default App;