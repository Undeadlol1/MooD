FIXME: elaborate about "everything is a node".
There is a problem involving node.rating. Since every upvote incerements rating by one and downvote decrements rating by same amount there can be multiple nodes with same rating. This creates undesired infinite loops in a playlist.
In order to solve this issue, node.rating must a unique value for every node. So, instead of making node.rating a simple number it is a decimal string. It is created by adding creation date after decimal point. Example:
`const node.rating = 3.1519180726251`
Where 3 = upvotes - downvotes, and 1519180726251 is a timestamp.