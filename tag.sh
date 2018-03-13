#!/bin/bash
while IFS=  read -r -d $'\0'; do
  content=$REPLY
  tags="$(grep '^tags = ' $content | awk -F '=' '{ print $2 }')"
  if [ ! -z "$tags" ]; then
    # strip white space
    tags=${tags// /}
    # substitute , with space
    tags=${tags//,/ }
    # remove [ and ]
    tags=${tags##[}
    tags=${tags%]}
    eval tags=($tags)
    tmsu tag $content ${tags[@]}
  fi
done < <(find content -name "*.md" -print0)


