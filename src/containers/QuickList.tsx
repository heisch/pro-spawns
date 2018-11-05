import {ApplicationState} from "../reducers";
import {connect} from "react-redux";
import {getQuickList} from "../selectors/quick_list";
import {setFilterPokemon} from "../actions/filter";
import QuickList from "../components/QuickList";

const mapStateToProps = (state: ApplicationState) => ({
    quick_list: getQuickList(state)
});

const mapDispatchToProps = {
    setFilterPokemon: setFilterPokemon
};

export default connect(mapStateToProps, mapDispatchToProps)(QuickList)
