To make the smart contract persitent and unique to every new initialisation of our project.

issues:
1. Behave differently than a centralized database. Volume persist accross initialisation.


Solutions:
1. Deploy a a new Game array struct for every new instance.
2. Store the index of the instance in the Postegres database per user to retrieve it even after a deepclean.