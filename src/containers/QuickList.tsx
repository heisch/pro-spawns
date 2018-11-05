import {ApplicationState} from "../reducers";
import {connect} from "react-redux";
import {getQuickList} from "../selectors/quick_list";
import {setFilterPokemon} from "../actions/filter";
import QuickList from "../components/QuickList";
import {Action, Dispatch} from "redux";

const mapStateToProps = (state: ApplicationState) => ({
    quick_list: getQuickList(state)
});

const mapDispatchToProps = (dispatch: Dispatch<Action<any>>) => ({
    setFilterPokemon: (pokemon: string) => dispatch(setFilterPokemon(pokemon))
});

export default connect(mapStateToProps, mapDispatchToProps)(QuickList)
