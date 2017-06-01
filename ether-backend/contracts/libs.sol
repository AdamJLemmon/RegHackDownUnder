// Collection of useful libraries to make use of
import {BaseItem as BaseItem} from "./base.sol";
import "./form.sol";
import "./party.sol";

/*** @title Data Item Utilities */
library DataItem {
	/** Currently utilized for party and item functionality and storage
	*/

	// State of this specific item, default to inactive
    enum State { active, inactive }

    // Associations of parties to forms and forms to parties
    struct Association {
        bytes32 role; // the role type of this association, fill, approve, etc.
        bool complete; // state of the association
        address associate; // contract address of the associte
    }

    struct Data {
    	address registry;
    	State state;
    	Association[] associations;
    	// Get list of associations based on a specific role
    	mapping(bytes32=>uint[]) roleToAssociationIndexes;
    	// Get all associations with a specific contract
    	mapping(address=>uint[]) addressToAssociationIndexes;
    }


    // @Modifiers
    modifier roleExists(Data storage self, bytes32 role) {
    	if (self.roleToAssociationIndexes[role].length != 0)_;
    }


    // @Public
    function associationAdd(Data storage self, bytes32 _role, address _associate) {
    	// Add an association with anoth contract to this contract
    	// @param role: the role this association plays
    	// @param associate: the address of the contract to associate with
    	self.associations.push(Association({
    		role: _role,
    		complete: false,
    		associate: _associate
		}));

		uint associationIndex = self.associations.length - 1;

		// Update mappings to find this association later
		// All associations with this associate contract
		self.addressToAssociationIndexes[_associate].push(associationIndex);

		// All associations of this type of role
		self.roleToAssociationIndexes[_role].push(associationIndex);
    }

    function associationRoleGetTotal(Data storage self, bytes32 role) returns(uint numberOfRole) {
        // Return all of the associations indexes that match the role
        // Grab the list of associations that have this role, concat into
        // @param role: the role type to lookup
        // @return: the quantity of associations with this role
        return self.roleToAssociationIndexes[role].length;
    }

    function associationRoleGetAtIndex(
    	Data storage self, 
    	bytes32 role, 
    	uint roleIndex
	) returns(address) {
        // Get the address of an association of a given role as an index
        // Ex. there are 3 associations with the role: 'fill' = ['a', 'b', 'c']
        // Specifying 'fill', 1 will return 'b'
        // @param role: the role type to lookup
        // @param roleIndex: index within array of associations of this role
        // @return: address of the associate contract
        uint associateIndex = self.roleToAssociationIndexes[role][roleIndex];
        return self.associations[associateIndex].associate;
    }
}