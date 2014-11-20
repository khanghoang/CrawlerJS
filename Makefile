# Simple grunt poroxy so we don't need to
# install it globally

$(MAKECMDGOALS):
	node ./node_modules/grunt-cli/bin/grunt $(MAKECMDGOALS);

.PHONY: $(MAKECMDGOALS)
