import {ApplicationState} from "../store/reducers";
import {connect} from "react-redux";
import {getQuickList} from "../store/selectors/quick_list";
import {setFilterPokemon} from "../store/actions/filter";
import QuickList from "../components/QuickList";
import {Action, Dispatch} from "redux";

const mapStateToProps = (state: ApplicationState) => ({
    quick_list: getQuickList(state)
});

const mapDispatchToProps = (dispatch: Dispatch<Action<any>>) => ({
    setFilterPokemon: (pokemon: string) => dispatch(setFilterPokemon(pokemon))
});

export default connect(mapStateToProps, mapDispatchToProps)(QuickList)
