import React from "react";
import {Button, List, Segment} from "semantic-ui-react";
import {QuickListEntry} from "../store/reducers/quick_list";

interface QuickListProps {
    quick_list: QuickListEntry[]
    setFilterPokemon: (pokemon: string) => void
}
interface QuickListState {
}

export default class QuickList extends React.Component<QuickListProps, QuickListState> {
    render() {
        const quickListData = this.props.quick_list;
        return (
            !quickListData ? null :
                <Segment>
                    <List horizontal >
                        {quickListData.map((entry, index) => (
                            <List.Item key={index}>
                                <Button className='btn-lnk' onClick={() => this.props.setFilterPokemon(entry.name)}>
                                    <i className={`pokedex-sprite pokedex-sprite-${entry.id}`}/>
                                    {entry.name}
                                </Button>
                            </List.Item>))}
                    </List>
                </Segment>
        );
    }
}
