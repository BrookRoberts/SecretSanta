from SecretSanta import secretSantaCycle

names = [("br","enter_full_email_address@somewhere.com"),
         ("ru", None),
         ("ja", None),
         ("aa",None),
         ("be", None),
         ("ka", None),
         ("ed", None),
         ("ma", None),
         ("fa", None),
         ("ka", None)]
pairs = [["br", "be"],
         ["ja", "aa"],
         ["ru", "ka"],
         ["ma", "fa"]]
settings = {}
settings'participants'] = names
settings['forbidden_pairs'] = pairs
secretSantaCycle(settings)

# ('ed', <__main__.Person instance at 0x10f018dd0>)
# ('ma', <__main__.Person instance at 0x10f0682d8>)
# ('ja', <__main__.Person instance at 0x10ef475a8>)
# ('br', <__main__.Person instance at 0x10f068a28>)
# ('ru', <__main__.Person instance at 0x10f0813b0>)
# ('ka', <__main__.Person instance at 0x10f0685a8>)
# ('aa', <__main__.Person instance at 0x10f018f38>)
# ('be', <__main__.Person instance at 0x10f018bd8>)
# ('ka', <__main__.Person instance at 0x10f081368>)
# ('fa', None)
