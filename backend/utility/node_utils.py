def add_vtags_to_network(network: dict, verbose=False, logger=None):
    """Adds virtual tags to all sub-networks of a given network

    Parameters
    ----------
    network : pype_schema.node.Network
        Network object to add virtual tags to

    verbose : bool
        If True, informative print statements will be printed to console for debugging

    logger : logging.Logger
        Optional logger object to log messages to

    """
    networks = [
        network for network in network.get_list_of_type(Network, recurse=False)
    ] + [network]
    for subnetwork in networks:
        # Only add vtags to "Facility networks" (otherwise things like electricity demand don't make sense)
        if isinstance(subnetwork, Facility):
            for cogen in subnetwork.get_list_of_type(Cogeneration, recurse=True):
                if verbose:
                    ut.log_message(f"Checking virtual tag for {cogen.id}", logger)
                check_add_cogen_production_tag(subnetwork, cogen)
            if verbose:
                ut.log_message(f"Adding virtual tags to {subnetwork.id}", logger)
            add_vtags_to_network_helper(
                network, subnetwork.id, verbose=verbose, logger=logger
            )
    return network
    

def find_connection(network: dict, node_id: str):
    """
        Remove a node from the network.

        Parameters:
            network (str): The ID of the network.
            node_id (str): The ID of the node to find its conenctions.


        Returns:
            connections (array): The list of connections to the node.

        Examples:
            List all connections of node456 in network123
            >>> find_connection('network123', 'node456')

        """
    connections = []
    for key, value in network.items():
        if isinstance(value, dict) and value.get('source') == node_id and key not in connections:
            connections.append(key)
        elif isinstance(value, dict) and value.get('destination') == node_id and key not in connections:
            connections.append(key)
    return connections


def remove_child_node(network: dict, node_id: str, parent_id: str):
    """
       Remove a child node from the network.

       This function deletes a child node from the network dictionary and removes its references from the parent node.

       Parameters:
           network (dict): The network dictionary.
           node_id (str): The ID of the child node to be removed.
           parent_id (str): The ID of the parent node.

       Returns:
        - Dictionary containing the status of the operation and the updated network if successful.
           {"status": "success", "network": network}

       Examples:

            Remove a child node
           >>> remove_child_node(network, "child1", "parent1")

            The child node "child1" is removed from the network and the parent's child list,
            as well as the associated connections are removed.

       """
    try:
        checked = handle_tags(network, node_id)
        network = checked["network"]
        # delete the actual node
        network = {k: v for k, v in network.items() if k != node_id}
        # delete the node from parent's child list
        network[parent_id]["nodes"] = [x for x in network[parent_id]["nodes"] if x != node_id]

        # remove connections
        conn = find_connection(network, node_id)

        for key in conn:
            # delete from parent nodes connections
            network[parent_id]["connections"] = [x for x in network[parent_id]["connections"] if x != key]
            # delete the actual connection from network
            network = {k: v for k, v in network.items() if k != key}

    except Exception as e:
        res = {"status": "failure", "message": e}
    else:
        res = {"status": "success", "network": network}
    return res


def handle_tags(network: dict, node_id: str):
    """
       Update the tags in the virtual_tags of the given network based on the node's tags.

       Args:
           network (dict): The network dictionary containing virtual_tags and node information.
           node_id (str): The identifier of the node to handle the tags for.

       Returns:
           dict: A dictionary with the status of the operation and the updated network.

       Raises:
           Exception: If an error occurs during the tag handling process.
       """
    try:
        node_tags = network[node_id]["tags"]
        virtual_tags = network["virtual_tags"]
        if node_tags:
            for virtual_tag in virtual_tags:
                virtual_tag_tags = virtual_tags[virtual_tag]["tags"]
                original_length = len(virtual_tag_tags)
                virtual_tags[virtual_tag]["tags"] = [t for t in virtual_tag_tags if t not in node_tags]
                virtual_tag_tags = virtual_tags[virtual_tag]["tags"]
                if len(virtual_tag_tags) < original_length:
                    if len(virtual_tag_tags) < 1:
                        network["virtual_tags"] = {k: v for k, v in network["virtual_tags"].items() if k != virtual_tag}
                    elif len(virtual_tag_tags) < 2:
                        virtual_tags[virtual_tag]["binary_operations"] = []
                    else:
                        virtual_tags[virtual_tag]["binary_operations"] = virtual_tags[virtual_tag]["binary_operations"]
                        # TODO: figure this out / will this ever happen?

    except Exception as e:
        res = {"status": "failure", "message": e}
    else:
        res = {"status": "success", "network": network}
    return res