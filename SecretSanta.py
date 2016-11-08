import random
SEND_EMAILS = False
SANTA_EMAIL = "ENTER_GMAIL_ACCOUNT"
EMAIL_PASSWORD = "ENTER_GMAIL_PASSWORD"

class Person:
    def __init__(self, name, email_address):
        self.name = name
        self.allowed_targets = set()
        self.email_address = email_address
        self.target = None

    def __str__(self):
        return self.name


def main():
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
    people = set()
    for name in names:
        people.add(Person(name[0], name[1]))

    for person in people:
        for target in people:
            person.allowed_targets.add(target)
    remove_pair(people, "br", "be")
    remove_pair(people, "ja", "aa")
    remove_pair(people, "ru", "ka")
    remove_pair(people, "ma", "fa")

    first_person = next(iter(people))

    cycle = get_cycle(people, {first_person}, [first_person])
    if not cycle:
        print("No cycle found")
    else:
        for person in cycle:
            print(person.name)
        # print(cycle) - want to define my own print method here

        if SEND_EMAILS:
            for person in cycle:
                send_email(SANTA_EMAIL, EMAIL_PASSWORD, person.email_address, "Secret Santa",
                           "You will be getting a gift for " + person.target)


def remove_pair(people, first_name, second_name):
    first_person = None
    second_person = None
    for person in people:
        if first_name == person.name:
            first_person = person
        if second_name == person.name:
            second_person = person
    if not first_person or not second_person:
        #tried to remove not existant people
        raise Exception
    first_person.allowed_targets.discard(second_person)
    second_person.allowed_targets.discard(first_person)
    return


def get_cycle(people, allocated_people, cycle_so_far):
    person = cycle_so_far[-1]
    if len(cycle_so_far) == len(people):
        if cycle_so_far[0] in cycle_so_far[-1].allowed_targets:
            return cycle_so_far
        else:
            return None
    targets_to_try = list(person.allowed_targets.difference(allocated_people))

    # For each person that we could add to our cycle, we recurse and see if we could get a cycle
    for i in range(len(targets_to_try)):
        target = random.choice(targets_to_try)
        targets_to_try.remove(target)
        allocated_people.add(target)
        cycle_so_far[-1].target = target
        cycle_so_far.append(target)
        cycle = get_cycle(people, allocated_people, cycle_so_far)
        if cycle:
            return cycle
        cycle_so_far.pop()
        cycle_so_far[-1].target = None
        allocated_people.remove(target)
    return None

def send_email(user, pwd, recipient, subject, body):
    import smtplib

    gmail_user = user
    gmail_pwd = pwd
    FROM = user
    TO = recipient if type(recipient) is list else [recipient]
    SUBJECT = subject
    TEXT = body

    # Prepare actual message
    message = """From: %s\nTo: %s\nSubject: %s\n\n%s
    """ % (FROM, ", ".join(TO), SUBJECT, TEXT)
    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.ehlo()
        server.starttls()
        server.login(gmail_user, gmail_pwd)
        server.sendmail(FROM, TO, message)
        server.close()
        print('successfully sent the mail')
    except:
        print("failed to send mail")

main()

